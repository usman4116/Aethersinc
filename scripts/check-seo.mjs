import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';

const dist = resolve('dist');
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
assert.equal(paths.length, new Set(paths).size, 'Sitemap contains no duplicate URLs');
assert.equal(paths.length, 17, 'All main, service, founder and product pages are in the sitemap');
const sourceMap = await readFile('public/sitemap.xml', 'utf8');
assert.deepEqual(new Set([...sourceMap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])), new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])), 'Development and production sitemap agree');
const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8');
assert.match(robots, /User-agent: \*\s+Allow: \//);
assert.match(robots, /Sitemap: https:\/\/aethersync.tech\/sitemap.xml/);
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
assert.equal(config.cleanUrls, true);
assert.ok(!config.rewrites, 'Unknown routes must not rewrite to the homepage');

// Local static host matching the clean-URL production layout, with real 404s.
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4' };
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    let file = resolve(dist, '.' + (path === '/' ? '/index.html' : extname(path) ? path : path + '.html'));
    if (!file.startsWith(dist + '/')) { res.writeHead(403); res.end(); return; }
    if (!(await stat(file).catch(() => null))?.isFile()) { file = resolve(dist, '404.html'); res.statusCode = 404; }
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(500); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.AETHERSYNC_BROWSER || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined), headless: true, args: ['--no-sandbox'] });
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  const page = await noJs.newPage();
  const titles = new Set();
  for (const path of paths) {
    const response = await page.goto(base + path);
    assert.equal(response.status(), 200, path);
    assert.equal(await page.locator('h1').count(), 1, `${path} has one primary heading without JS`);
    assert.ok(await page.locator('h1').isVisible(), `${path} heading is visible without JS`);
    assert.ok((await page.locator('main').innerText()).length > 250, `${path} includes real content without JS`);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://aethersync.tech${path}`);
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), `https://aethersync.tech${path}`);
    assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /^index,/);
    const title = await page.title();
    assert.ok(!titles.has(title), `${path} has a unique title`); titles.add(title);
    const graph = JSON.parse(await page.locator('#site-schema').textContent())['@graph'];
    assert.equal(graph.find(item => item['@type'] === 'Organization').name, 'Aethersync Technology Solutions');
    const person = graph.find(item => item['@type'] === 'Person');
    assert.equal(person.alternateName, 'Usman Farhan');
    assert.equal(person.jobTitle, 'CEO & Founder');
    if (path !== '/') assert.ok(graph.some(item => item['@type'] === 'BreadcrumbList'), `${path} breadcrumbs`);
    const links = await page.locator('a[href^="/"]').evaluateAll(elements => elements.map(el => el.getAttribute('href')));
    for (const link of links) assert.ok(paths.includes(new URL(link, base).pathname), `${path} internal link ${link} resolves`);
  }
  const missing = await page.goto(base + '/does-not-exist');
  assert.equal(missing.status(), 404);
  assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
  await page.goto(base + '/about/usman-farhan');
  assert.match(await page.locator('main').innerText(), /Usman Farhan, is the CEO and founder of Aethersync Technology Solutions/);

  const errors = [];
  const interactive = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const live = await interactive.newPage();
  live.on('pageerror', error => errors.push(error.message));
  live.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const path of paths) {
    await live.goto(base + path);
    await live.waitForTimeout(150);
    assert.equal(await live.locator('#site-schema').count(), 1, `${path} one schema after hydration`);
    assert.equal(await live.locator('link[rel="canonical"]').getAttribute('href'), `https://aethersync.tech${path}`);
  }
  await live.goto(base + '/services/website-development');
  await live.locator('.discovery-questions summary').first().click();
  assert.equal(await live.locator('.discovery-questions details[open]').count(), 1, 'FAQs work after hydration');
  await live.locator('.discovery-breadcrumb').getByRole('link', { name: 'Services', exact: true }).click();
  await live.waitForURL('**/services');
  await live.waitForFunction(() => document.querySelector('link[rel="canonical"]').href === 'https://aethersync.tech/services');
  assert.match(await live.title(), /ERP Services/);
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const small = await mobile.newPage();
  await mkdir('review/seo', { recursive: true });
  for (const path of ['/services/website-development', '/services/custom-software-development', '/services/erp-development', '/about/usman-farhan']) {
    await small.goto(base + path);
    assert.ok(await small.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} mobile overflow`);
  }
  await small.screenshot({ path: 'review/seo/founder-mobile.png' });
  await live.goto(base + '/services/website-development');
  await live.screenshot({ path: 'review/seo/service-desktop.png' });
  const animated = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const motion = await animated.newPage();
  motion.on('pageerror', error => errors.push(error.message));
  motion.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const path of ['/', '/services/erp-development', '/about/usman-farhan']) {
    await motion.goto(base + path);
    await motion.waitForTimeout(1800);
    assert.ok(await motion.locator('h1').isVisible(), `${path} animated heading is visible`);
    await motion.evaluate(() => scrollTo(0, document.body.scrollHeight / 2));
    await motion.waitForTimeout(250);
    assert.ok(await motion.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} animated layout does not overflow`);
  }
  assert.deepEqual(errors, [], 'No runtime or hydration errors');
  console.log('PASS: 17 HTML pages, metadata, entities, internal links, sitemap, real 404, no-JS content, hydration, mobile layout and client navigation.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
