import assert from 'node:assert/strict';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const url = process.env.AETHERSYNC_BASE_URL || 'http://localhost:5177';
const executablePath = process.env.AETHERSYNC_BROWSER || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const errors = [];
const results = [];
const routes = ['products', 'services', 'projects', 'about'];
const platforms = [
  ['purple-ai', 'Purple AI', 'In development'], ['open-erp', 'Open ERP', 'Live'],
  ['corpflow', 'Corpflow', 'Live'], ['finraze', 'Finraze', 'Live'],
  ['fact-checking', 'Fact Checking', 'In development'],
  ['laundry-management', 'Laundry Management', 'In development'], ['futurepath-ai', 'FuturePath AI', 'Live'],
];
mkdirSync('review/pages', { recursive: true });
function observe(page) {
  page.setDefaultTimeout(9000);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
}
async function visit(page, route) {
  await page.goto(`${url}/${route}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}
async function layout(page, label) {
  assert.equal(await page.locator('h1').count(), 1, `${label}: one primary heading`);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: page width`);
  const clipped = await page.locator('.design-page h1, .design-page h2, .design-page h3, [data-title-line]').evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.textContent));
  assert.deepEqual(clipped, [], `${label}: readable headings`);
}
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  observe(page);
  await visit(page, 'products');
  await page.getByRole('button', { name: 'Preview Laundry Management', exact: true }).click();
  assert.equal(await page.locator('.console-active h2').innerText(), 'Laundry Management');
  await page.locator('.console-active a').click();
  await page.waitForURL('**/products/laundry-management');
  assert.equal(await page.locator('h1').innerText(), 'Laundry Management');
  await page.getByRole('link', { name: 'The ecosystem', exact: true }).click();
  for (const [name, count] of [['Artificial intelligence', 3], ['Business operations', 3], ['Finance', 1], ['All platforms', 7]]) {
    await page.getByRole('group', { name: 'Filter products' }).getByRole('button', { name, exact: true }).click();
    assert.equal(await page.locator('.platform-grid > article').count(), count, name);
  }
  for (let index = 0; index < 3; index++) {
    await page.locator('.ecosystem-chapter').nth(index).evaluate(el => scrollTo({top:el.getBoundingClientRect().top+scrollY-innerHeight*.32,behavior:'instant'}));
    await page.waitForTimeout(900);
    assert.ok(Number(await page.locator('.ecosystem-cluster-' + index).evaluate(el => getComputedStyle(el).opacity)) > .95, 'scrolling connects the product group');
    assert.match(await page.locator('.ecosystem-position').innerText(), new RegExp('0' + (index+1)));
  }
  results.push('Product explorer navigation, filters and all three scroll-driven ecosystem chapters work.');

  await visit(page, 'services');
  const disciplines = page.getByRole('navigation', { name: 'Solution disciplines' });
  await disciplines.getByRole('link', { name: /Cloud & DevOps/ }).click();
  await page.waitForFunction(() => Math.abs(document.querySelector('#cloud-devops').getBoundingClientRect().top - 48) < 3);
  assert.match(await disciplines.locator('[aria-current]').innerText(), /Cloud & DevOps/);
  await visit(page, 'services#erp-systems');
  await page.waitForFunction(() => Math.abs(document.querySelector('#erp-systems').getBoundingClientRect().top - 48) < 3);
  const tabs = page.getByRole('tablist', { name: 'Development process' });
  await tabs.getByRole('tab', { name: /Discovery/ }).click();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.getByRole('tabpanel').locator('h3').innerText(), 'Requirement analysis');
  await page.keyboard.press('End');
  assert.equal(await page.getByRole('tabpanel').locator('h3').innerText(), 'Continuous support');
  results.push('Solutions index, direct section links and keyboard process tabs work.');

  await visit(page, 'projects');
  await page.locator('.reel-is-pinned').waitFor();
  const chapters = page.getByRole('group', { name: 'Featured project chapters' });
  for (const name of ['Acrylica','Lumea Skin Care','Rexo Perfume']) {
    await chapters.getByRole('button', { name: new RegExp(name) }).click();
    await page.waitForFunction(name => document.querySelector('.reel-project[aria-hidden="false"] h2')?.textContent === name, name);
    await page.waitForTimeout(900);
    assert.equal(await page.locator('.reel-project:not([inert])').count(), 1, 'only the active project should receive focus');
  }
  await chapters.getByRole('button', { name: /Acrylica/ }).click();
  await page.waitForFunction(() => document.querySelector('.reel-project[aria-hidden="false"] h2')?.textContent === 'Acrylica');
  await page.waitForTimeout(1000);
  const activeScreen = page.locator('.reel-project[aria-hidden="false"] .reel-screen');
  await activeScreen.click();
  await page.getByRole('dialog', { name: 'Acrylica' }).waitFor();
  assert.equal(await page.locator('.work-preview-screen').getAttribute('href'), 'https://unique-acrylica.vercel.app/');
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'detached' });
  assert.equal(await activeScreen.evaluate(el => el === document.activeElement), true);
  const workFilters = page.getByRole('group', { name: 'Filter client work' });
  await workFilters.getByRole('button', { name: 'Product / Retail', exact: true }).click();
  assert.equal(await page.locator('.archive-project').count(), 2);
  await workFilters.getByRole('button', { name: 'Hospitality', exact: true }).click();
  assert.equal(await page.locator('.archive-project h3').innerText(), 'Coffee Shop');
  await page.locator('.archive-image').click();
  await page.getByRole('dialog', { name: 'Coffee Shop' }).waitFor();
  await page.getByRole('button', { name: 'Close website preview' }).click();
  await page.getByRole('dialog').waitFor({ state: 'detached' });
  await workFilters.getByRole('button', { name: 'All work', exact: true }).click();
  assert.equal(await page.locator('.archive-project').count(), 7);
  results.push('The project reel follows scrolling; chapter controls, focus isolation, archive filters and enlarged previews work.');

  await visit(page, 'about');
  assert.equal(await page.locator('.company-founder').count(), 1);
  await page.locator('.company-founder-portrait img').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.company-founder-portrait img').naturalWidth > 0);
  assert.match(await page.locator('h1').evaluate(el => getComputedStyle(el).fontFamily), /Cabinet Grotesk/);
  assert.match(await page.locator('h1 em').evaluate(el => getComputedStyle(el).fontFamily), /Gambetta/);
  results.push('Company founder content, portrait and locally hosted typefaces load.');

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  observe(reduced);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await reduced.setViewportSize({ width, height: 900 });
    for (const route of [...routes, ...platforms.map(([slug]) => `products/${slug}`)]) {
      await visit(reduced, route);
      await layout(reduced, `${route} at ${width}px`);
      if (route.startsWith('products/')) {
        const [, name, status] = platforms.find(([slug]) => route.endsWith('/' + slug));
        assert.equal(await reduced.locator('h1').innerText(), name);
        assert.equal((await reduced.locator('.platform-detail-heading .status').innerText()).toLowerCase(), status.toLowerCase());
      }
      if (routes.includes(route)) {
        assert.equal(await reduced.locator('[data-title-line]').first().evaluate(el => getComputedStyle(el).opacity), '1');
        const moving = await reduced.locator('.design-page').evaluate(el => el.getAnimations({ subtree: true }).filter(animation => animation.effect.getTiming().iterations === Infinity && animation.playState === 'running').length);
        assert.equal(moving, 0, `${route}: reduced motion stops continuous movement`);
      }
    }
  }
  await visit(reduced, 'projects');
  assert.equal(await reduced.locator('.reel-is-pinned, .reel-project[inert]').count(), 0, 'reduced motion exposes every project without pinning');
  assert.equal(await reduced.locator('.reel-project').count(), 3);
  results.push('All four pages and seven product details fit 320, 390, 768, 1024 and 1440px; reduced motion keeps content visible and stops continuous animation.');

  for (const [width, height, device] of [[1440, 1000, 'desktop'], [390, 844, 'mobile']]) {
    await page.setViewportSize({ width, height });
    for (const route of routes) {
      await visit(page, route);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `review/pages/${route}-${device}.png` });
      await page.evaluate(() => window.scrollTo({ top: 1050, behavior: 'instant' }));
      await page.waitForTimeout(1100);
      await page.screenshot({ path: `review/pages/${route}-${device}-scroll.png` });
    }
  }
  assert.deepEqual(errors, [], 'no browser errors');
  results.push('No JavaScript or console errors across page interactions and viewport changes.');
  writeFileSync('review/pages/verification.json', JSON.stringify({ url, results, errors }, null, 2));
  results.forEach(result => console.log('PASS ' + result));
} finally {
  await browser.close();
}
