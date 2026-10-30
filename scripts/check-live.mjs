import assert from 'node:assert/strict';

const origin = process.env.AETHERSYNC_LIVE_URL || 'https://www.aethersync.tech';
async function request(url, type) {
  const seen = new Set();
  for (let hop = 0; hop < 6; hop++) {
    assert.ok(!seen.has(url), `Redirect loop detected: ${[...seen, url].join(' -> ')}`);
    seen.add(url);
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      assert.ok(location, `${url}: redirect missing Location`);
      url = new URL(location, url).href;
      continue;
    }
    assert.equal(response.status, 200, `${url}: HTTP status`);
    assert.ok((response.headers.get('content-type') || '').includes(type), `${url}: expected ${type}, got ${response.headers.get('content-type')}`);
    assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), `${url}: indexing blocked by header`);
    return { url, body: await response.text() };
  }
  throw new Error(`Too many redirects: ${url}`);
}

const home = await request(origin + '/', 'text/html');
assert.equal(home.url, origin + '/', 'Canonical host must serve content without redirecting to another host');
const assets = [...home.body.matchAll(/(?:src|href)="(\/assets\/[^"?]+\.(?:js|css))"/g)].map(match => match[1]);
assert.ok(assets.some(path => path.endsWith('.css')), 'HTML includes stylesheet');
assert.ok(assets.some(path => path.endsWith('.js')), 'HTML includes application script');
await Promise.all(assets.map(path => request(origin + path, path.endsWith('.css') ? 'text/css' : 'javascript')));
const robots = await request(origin + '/robots.txt', 'text/plain');
assert.ok(robots.body.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt uses canonical sitemap');
assert.match(robots.body, /User-agent: \*\s+Allow: \//);
const sitemap = await request(origin + '/sitemap.xml', 'xml');
const urls = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.ok(urls.length >= 17, 'Sitemap includes public routes');
for (let offset = 0; offset < urls.length; offset += 4) {
  await Promise.all(urls.slice(offset, offset + 4).map(async url => {
    assert.equal(new URL(url).origin, origin, 'Sitemap URLs use canonical host');
    const page = await request(url, 'text/html');
    assert.equal(page.url, url, 'Sitemap URL must resolve directly');
    assert.ok(page.body.includes(`<link rel="canonical" href="${url}"`), `${url}: matching canonical`);
    assert.ok(page.body.includes('name="robots" content="index, follow'), `${url}: indexable metadata`);
    assert.ok(page.body.includes('id="site-schema"'), `${url}: structured data`);
    assert.ok(page.body.includes('<h1'), `${url}: prerendered heading`);
  }));
}
if (origin === 'https://www.aethersync.tech') {
  for (const path of ['/', '/robots.txt', '/sitemap.xml', assets.find(path => path.endsWith('.css'))]) {
    const result = await request(`https://aethersync.tech${path}`, path.endsWith('.css') ? 'text/css' : path.endsWith('.xml') ? 'xml' : path.endsWith('.txt') ? 'text/plain' : 'text/html');
    assert.equal(result.url, origin + path, 'Apex redirects to the canonical host');
  }
}
console.log(`PASS: live CSS/JavaScript, domain redirects, robots.txt, sitemap and ${urls.length} indexable pages. This checks technical eligibility, not Google indexing or rankings.`);
