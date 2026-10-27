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
  await desktop.locator('.mistral-hero[data-opened="true"]').waitFor();
  assert.equal(await desktop.locator('.site-header').evaluate(el => el.offsetHeight), 48, 'reference navigation should be 48px high');
  assert.equal(await desktop.evaluate(() => document.documentElement.classList.contains('lenis')), false, 'desktop should use native scrolling');
  const titleClipped = await desktop.locator('.hero-headline-line').evaluateAll(lines => lines.some(line => line.scrollWidth > line.clientWidth + 1));
  assert.equal(titleClipped, false, 'the complete headline must fit');
  assert.equal(await desktop.locator('.pin-spacer').count(), 1, 'only the product story should be pinned');
  await assertNoOverflow(desktop, 'desktop hero');
  await desktop.screenshot({ path: 'review/motion/desktop-hero.png' });

  await desktop.getByRole('button', { name: 'Products', exact: true }).click();
  await desktop.locator('#nav-dropdown-products').waitFor();
  await desktop.keyboard.press('Escape');
  assert.equal(await desktop.locator('.nav-dropdown').count(), 0, 'Escape should close the dropdown');
  assert.equal(await desktop.getByRole('button', { name: 'Products', exact: true }).evaluate(el => el === document.activeElement), true, 'Escape should return focus to the trigger');
  results.push('The hero entrance completes, its headline fits, and the 48px navigation supports keyboard dismissal.');
  const initialTransform = await desktop.locator('.hero-title-parallax').evaluate(el => getComputedStyle(el).transform);
  await desktop.mouse.wheel(0, 400);
  await desktop.waitForTimeout(700);
  assert.ok(await desktop.evaluate(() => scrollY > 20), 'wheel scrolling should move the page');
  const scrolledTransform = await desktop.locator('.hero-title-parallax').evaluate(el => getComputedStyle(el).transform);
  assert.notEqual(scrolledTransform, initialTransform, 'hero type should move with scroll');
  await desktop.screenshot({ path: 'review/motion/hero-scroll.png' });
  results.push('Native desktop wheel scrolling drives the hero parallax.');
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
  assert.equal(await desktop.locator('.pin-spacer').count(), 1, 'the product story pin should be created once when returning home');
  results.push('Chapter navigation and product links work; route changes clean up pinned layouts.');
  await desktop.evaluate(() => {
    const section = document.querySelector('#selected-work');
    window.scrollTo({ top: section.getBoundingClientRect().top + scrollY, behavior: 'instant' });
  });
  await desktop.waitForFunction(() => document.querySelector('#selected-work').dataset.running === 'true');
  const galleryX = page => page.locator('.work-track').evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
  const startX = await galleryX(desktop);
  const galleryScroll = await desktop.evaluate(() => scrollY);
  await desktop.waitForTimeout(1200);
  assert.ok(await galleryX(desktop) < startX - 25, 'gallery should move automatically without scrolling');
  assert.equal(await desktop.evaluate(() => scrollY), galleryScroll, 'gallery motion must not move the page');
  await desktop.screenshot({ path: 'review/motion/looping-work.png' });
  const card = await desktop.locator('.work-preview-trigger').first().boundingBox();
  await desktop.mouse.move(Math.max(100, card.x + card.width / 2), card.y + card.height / 2);
  await desktop.getByRole('dialog', { name: 'Acrylica' }).waitFor();
  await desktop.waitForTimeout(650);
  const preview = await desktop.locator('.work-preview-panel').boundingBox();
  assert.ok(preview.width > card.width * 1.4, 'hover should enlarge the website');
  assert.equal(await desktop.locator('#selected-work').getAttribute('data-running'), 'false', 'gallery should hold while a preview is open');
  assert.equal(await desktop.locator('#root').evaluate(el => el.inert), true, 'preview must contain keyboard focus');
  assert.equal(await desktop.locator('.work-preview-screen').getAttribute('href'), 'https://unique-acrylica.vercel.app/');
  const heldX = await galleryX(desktop);
  await desktop.waitForTimeout(300);
  assert.ok(Math.abs(await galleryX(desktop) - heldX) < 1, 'the gallery should stay still behind the preview');
  await desktop.screenshot({ path: 'review/motion/website-preview.png' });
  await desktop.mouse.move(8, 980);
  await desktop.getByRole('dialog').waitFor({ state: 'detached' });
  assert.equal(await desktop.locator('#root').evaluate(el => el.inert), false, 'leaving preview should restore the page');
  await desktop.waitForFunction(() => document.querySelector('#selected-work').dataset.running === 'true');
  await desktop.getByRole('button', { name: 'Pause project gallery' }).click();
  const pausedX = await galleryX(desktop);
  await desktop.waitForTimeout(350);
  assert.ok(Math.abs(await galleryX(desktop) - pausedX) < 1, 'pause control should stop the loop');
  await desktop.getByRole('button', { name: 'Play project gallery' }).click();
  await desktop.keyboard.press('Tab');
  await desktop.locator('.work-preview-trigger').nth(1).focus();
  await desktop.keyboard.press('Enter');
  await desktop.getByRole('dialog', { name: 'Lumea Skin Care' }).waitFor();
  await desktop.keyboard.press('Escape');
  await desktop.getByRole('dialog').waitFor({ state: 'detached' });
  assert.equal(await desktop.locator('.work-preview-trigger').nth(1).evaluate(el => el === document.activeElement), true, 'Escape should restore the triggering card');
  await assertNoOverflow(desktop, 'looping gallery');
  results.push('The gallery loops automatically; hover enlarges websites, leaving closes previews, and pause and keyboard controls work.');
  await desktop.locator('.ide-film').evaluate(el => scrollTo({top:el.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));
  await settle(desktop);
  await desktop.waitForFunction(() => !document.querySelector('.ide-film video').paused);
  assert.equal(await desktop.locator('.ide-launch').getAttribute('href'), 'https://ide.theaethersync.com/');
  assert.match(await desktop.locator('#ide-title').innerText(), /Pakistan’s first/);
  await desktop.getByRole('button', { name: 'Pause IDE video' }).click();
  assert.equal(await desktop.locator('.ide-film video').evaluate(el => el.paused), true);
  results.push('The IDE feature links to the live site, displays the requested headline and plays its introduction video with a working pause control.');
  await desktop.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await settle(desktop);
  await desktop.screenshot({ path: 'review/motion/footer.png' });
  const footerOpacity = await desktop.locator('.footer-wordmark').evaluate(element => getComputedStyle(element).opacity);
  assert.equal(footerOpacity, '1', 'footer should be visible');

  for (const width of [320, 390, 768, 1024]) {
    await desktop.setViewportSize({ width, height: 900 });
    await desktop.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await settle(desktop);
    await desktop.locator('.mistral-hero[data-opened="true"]').waitFor();
    await assertNoOverflow(desktop, width + 'px viewport');
    assert.equal(await desktop.locator('.hero-headline-line').evaluateAll(lines => lines.some(line => line.scrollWidth > line.clientWidth + 1)), false, width + 'px headline must fit');
    assert.equal(await desktop.locator('.hero-rail-left .hero-square').first().evaluate(el => el.clientWidth), width < 1024 ? 60 : 120, 'hero blocks must resize with the viewport');
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
  assert.equal(await mobile.locator('main').evaluate(el => el.inert), true, 'mobile menu should contain keyboard focus');
  const menuBottom = await mobile.locator('#mobile-nav').evaluate(el => el.getBoundingClientRect().bottom);
  assert.equal(menuBottom, 844, 'mobile menu should cover the viewport');
  await mobile.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('button', { name: 'Solutions' }).click();
  await mobile.getByRole('link', { name: 'Explore our services' }).click();
  await mobile.waitForURL('**/services');
  await settle(mobile);
  assert.equal(await mobile.locator('main').evaluate(el => el.inert), false, 'route navigation should release focus');
  assert.equal(await mobile.evaluate(() => document.body.style.overflow), '', 'route navigation should restore scrolling');
  await assertNoOverflow(mobile, 'mobile services');
  results.push('Native touch scrolling and mobile menu navigation work.');

  await mobile.goto(url, { waitUntil: 'networkidle' });
  await mobile.evaluate(() => {
    const section = document.querySelector('#selected-work');
    window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - 55, behavior: 'instant' });
  });
  await mobile.waitForFunction(() => document.querySelector('#selected-work').dataset.running === 'true');
  const touchCard = await mobile.locator('.work-preview-trigger').first().boundingBox();
  await mobile.touchscreen.tap(Math.max(50, touchCard.x + touchCard.width / 2), touchCard.y + touchCard.height / 2);
  await mobile.getByRole('dialog').waitFor();
  await mobile.waitForTimeout(600);
  await mobile.screenshot({ path: 'review/motion/mobile-website-preview.png' });
  await mobile.getByRole('button', { name: 'Close website preview' }).click();
  await mobile.getByRole('dialog').waitFor({ state: 'detached' });
  await mobile.waitForFunction(() => document.querySelector('#selected-work').dataset.running === 'true');
  assert.equal(await mobile.evaluate(() => document.body.style.overflow), '', 'closing a touch preview should restore scrolling');
  const looped = await mobile.evaluate(() => new Promise(resolve => {
    const track = document.querySelector('.work-track');
    let previous = new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
    const deadline = performance.now() + 30000;
    function frame() {
      const current = new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
      if (current > previous + 100) {
        const groups = [...track.children].map(el => el.getBoundingClientRect());
        resolve(Math.abs(groups[0].right - groups[1].left) < 1);
      } else if (performance.now() > deadline) resolve(false);
      else { previous = current; requestAnimationFrame(frame); }
    }
    requestAnimationFrame(frame);
  }));
  assert.equal(looped, true, 'the loop should wrap seamlessly into the repeated group');
  await assertNoOverflow(mobile, 'mobile project gallery');
  results.push('Touch previews open and close, scrolling resumes, and the gallery completes a seamless loop.');

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  observe(reduced);
  await reduced.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await reduced.locator('.pin-spacer').count(), 0, 'reduced motion should disable pinning');
  assert.equal(await reduced.locator('.story-panel[inert]').count(), 0, 'reduced motion should expose all product chapters');
  assert.equal(await reduced.evaluate(() => document.documentElement.classList.contains('lenis')), false, 'reduced motion should use native scrolling');
  assert.ok(await reduced.locator('.hero-inline-flag img').evaluate(el => el.currentSrc.endsWith('/flag.png')), 'reduced motion should use a static flag');
  assert.ok(await reduced.locator('.hero-cat img').evaluate(el => el.currentSrc.endsWith('/cat.png')), 'reduced motion should use a static cat');
  assert.equal(await reduced.locator('.hero-headline').evaluate(el => getComputedStyle(el).visibility), 'visible', 'reduced-motion headline should be immediately visible');
  await reduced.screenshot({ path: 'review/motion/reduced-motion.png' });
  await reduced.locator('.ide-film').scrollIntoViewIfNeeded();
  await reduced.waitForTimeout(500);
  assert.equal(await reduced.locator('.ide-film video').evaluate(el => el.paused), true, 'reduced motion disables automatic video playback');
  assert.equal(await reduced.locator('#selected-work').evaluate(el => el.classList.contains('work-is-looping')), false, 'reduced motion should disable the gallery loop');
  assert.equal(await reduced.locator('.work-loop-group[aria-hidden=true]').isVisible(), false, 'reduced motion should hide repeated cards');
  await assertNoOverflow(reduced, 'reduced motion');
  results.push('Reduced-motion preference disables smoothing, pinning and continuous animations.');
  assert.deepEqual(errors, [], 'browser errors');
  results.push('No JavaScript or console errors.');
  writeFileSync('review/motion/verification.json', JSON.stringify({ url, results, errors }, null, 2));
  results.forEach(result => console.log('PASS ' + result));
} finally {
  await browser.close();
}
