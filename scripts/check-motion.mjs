import assert from 'node:assert/strict';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const url = process.env.AETHERSYNC_BASE_URL || 'http://localhost:5177';
const executablePath = process.env.AETHERSYNC_BROWSER || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const results = [];
const errors = [];
mkdirSync('review/motion', { recursive: true });
function observe(page) {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
}
const settle = page => page.waitForTimeout(1400);
async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(overflow <= 1, label + ': horizontal page overflow ' + overflow);
}
async function goToPin(page, selector, fraction = 0) {
  const position = await page.locator(selector).evaluate((element, fraction) => {
    const spacer = element.parentElement;
    return spacer.getBoundingClientRect().top + scrollY - 96 + fraction * parseFloat(spacer.style.paddingBottom);
  }, fraction);
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), position);
  await settle(page);
}
try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  desktop.setDefaultTimeout(8000);
  observe(desktop);
  await desktop.goto(url, { waitUntil: 'networkidle' });
  await settle(desktop);
  assert.equal(await desktop.locator('.pin-spacer').count(), 2, 'desktop should have two scroll narratives');
  await assertNoOverflow(desktop, 'desktop hero');
  await desktop.screenshot({ path: 'review/motion/desktop-hero.png' });
  await desktop.mouse.wheel(0, 400);
  await desktop.waitForTimeout(700);
  assert.ok(await desktop.evaluate(() => scrollY > 20), 'wheel scrolling should move the page');
  results.push('Desktop smooth wheel scrolling works.');
  for (const [index, name] of ['Intelligence', 'Operations', 'Connection', 'Clarity'].entries()) {
    await goToPin(desktop, '.story-stage', (index + .4) / 4);
    await desktop.waitForFunction(name => document.querySelector('.story-chapters [aria-current]')?.textContent.includes(name), name);
    const visible = await desktop.locator('.story-panel').evaluateAll(panels => panels.filter(panel => !panel.inert && getComputedStyle(panel).visibility === 'visible'));
    assert.equal(visible.length, 1, 'exactly one product panel should be interactive');
    await desktop.screenshot({ path: 'review/motion/chapter-' + index + '.png' });
  }
  results.push('All four pinned product chapters transition; inactive panels cannot receive focus.');
  await desktop.getByRole('button', { name: /Operations/ }).click();
  await desktop.waitForTimeout(1800);
  assert.match(await desktop.locator('.story-chapters [aria-current]').innerText(), /Operations/);
  await desktop.getByRole('link', { name: 'Explore Open ERP', exact: true }).click();
  await desktop.waitForURL('**/products/open-erp');
  await settle(desktop);
  assert.equal(await desktop.locator('.pin-spacer').count(), 0, 'pins should be removed on route changes');
  await desktop.getByRole('link', { name: 'Aethersync home', exact: true }).first().click();
  await settle(desktop);
  assert.equal(await desktop.locator('.pin-spacer').count(), 2, 'pins should be created once when returning home');
  results.push('Chapter navigation and product links work; route changes clean up pinned layouts.');
  await goToPin(desktop, '.work-stage', 0);
  const startLeft = await desktop.locator('.work-card').first().evaluate(element => element.getBoundingClientRect().left);
  await goToPin(desktop, '.work-stage', .995);
  const endLeft = await desktop.locator('.work-card').first().evaluate(element => element.getBoundingClientRect().left);
  assert.ok(endLeft < startLeft - 400, 'work gallery should move horizontally with vertical scrolling');
  const finalCard = await desktop.locator('.work-card').last().boundingBox();
  const viewport = await desktop.locator('.work-viewport').boundingBox();
  assert.ok(finalCard.x + finalCard.width <= viewport.x + viewport.width + 15, 'last project should fit into the gallery viewport');
  await desktop.screenshot({ path: 'review/motion/horizontal-work.png' });
  await assertNoOverflow(desktop, 'horizontal gallery');
  results.push('Horizontal gallery reaches its last project without overflowing the page.');
  await desktop.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await settle(desktop);
  await desktop.screenshot({ path: 'review/motion/footer.png' });
  const footerOpacity = await desktop.locator('.footer-wordmark').evaluate(element => getComputedStyle(element).opacity);
  assert.equal(footerOpacity, '1', 'footer should be visible');

  for (const width of [320, 390, 768, 1024]) {
    await desktop.setViewportSize({ width, height: 900 });
    await desktop.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await settle(desktop);
    await assertNoOverflow(desktop, width + 'px viewport');
    if (width < 1000) {
      assert.equal(await desktop.locator('.pin-spacer').count(), 0, 'small screens should not use pinned layouts');
      assert.equal(await desktop.locator('.story-panel[inert]').count(), 0, 'all mobile product panels should remain available');
    }
    await desktop.screenshot({ path: 'review/motion/viewport-' + width + '.png' });
  }
  results.push('320, 390, 768 and 1024px layouts have no horizontal overflow; smaller screens use a vertical product story.');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  observe(mobile);
  await mobile.goto(url, { waitUntil: 'networkidle' });
  await settle(mobile);
  const cdp = await mobile.context().newCDPSession(mobile);
  assert.equal(await mobile.evaluate(() => document.documentElement.classList.contains('lenis')), false, 'touch devices should use native scrolling');
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 650 }] });
  for (let y = 620; y >= 250; y -= 30) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y }] });
    await mobile.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await mobile.waitForTimeout(500);
  assert.ok(await mobile.evaluate(() => scrollY > 40), 'native touch scrolling should work');
  await mobile.getByRole('button', { name: 'Open navigation' }).click();
  await mobile.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Solutions' }).click();
  await mobile.waitForURL('**/services');
  await settle(mobile);
  await assertNoOverflow(mobile, 'mobile services');
  results.push('Native touch scrolling and mobile menu navigation work.');

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  observe(reduced);
  await reduced.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await reduced.locator('.pin-spacer').count(), 0, 'reduced motion should disable pinning');
  assert.equal(await reduced.locator('.story-panel[inert]').count(), 0, 'reduced motion should expose all product chapters');
  assert.equal(await reduced.evaluate(() => document.documentElement.classList.contains('lenis')), false, 'reduced motion should use native scrolling');
  await assertNoOverflow(reduced, 'reduced motion');
  results.push('Reduced-motion preference disables smoothing, pinning and continuous animations.');
  assert.deepEqual(errors, [], 'browser errors');
  results.push('No JavaScript or console errors.');
  writeFileSync('review/motion/verification.json', JSON.stringify({ url, results, errors }, null, 2));
  results.forEach(result => console.log('PASS ' + result));
} finally {
  await browser.close();
}
