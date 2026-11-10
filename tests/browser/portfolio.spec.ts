import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('academic identity, preview policy, anchors and unavailable assets are honest', async ({ page, request }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Huyen Ton Nu Bao Tien — Ph.D. Candidate/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Huyen Ton NuBao Tien.');
  await expect(page.getByText('Anticipated Dissertation Defense: August 2027', { exact: true })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  await expect(page.getByRole('link', { name: /Download CV|LinkedIn|ORCID|Google Scholar/ })).toHaveCount(0);
  await expect(page.locator('a[href*="doi.org"]')).toHaveCount(0);
  await expect(page.getByText('CV citation · unverified', { exact: true })).toHaveCount(4);
  await expect(page.getByText(/Co-first author/)).toHaveCount(0);
  const missingAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href')).filter(href => href && !document.getElementById(href.slice(1))));
  expect(missingAnchors).toEqual([]);
  const pdfSource = await request.get('/Huyen-Ton-Nu-Bao-Tien-TopCV.vn-091126.85321.pdf');
  expect(pdfSource.status()).toBe(404);
  const jsonSource = await request.get('/src/data/portfolio-content.seed.json');
  expect(jsonSource.status()).toBe(404);
});

test('year filters update entries and expose their selected state', async ({ page }) => {
  await page.goto('/#publications');
  await page.getByRole('button', { name: '2023', exact: true }).click();
  await expect(page.locator('.publication:visible')).toHaveCount(1);
  await expect(page.getByRole('button', { name: '2023', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.filter-result')).toHaveText('1 entry from 2023');
  await page.getByRole('button', { name: '2024', exact: true }).click();
  await expect(page.locator('.publication:visible')).toHaveCount(3);
  await page.getByRole('button', { name: 'All years' }).click();
  await expect(page.locator('.publication:visible')).toHaveCount(4);
});

test('mobile navigation opens, dismisses with Escape and closes on selection', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
    await toggle.click();
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Research', exact: true }).click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page).toHaveURL(/#research$/);
    await expect(page.locator('#research')).toBeFocused();
    await expect(page.locator('#primary-navigation a[href="#research"]')).toHaveAttribute('aria-current', 'location');
  } else {
    await page.getByRole('navigation').getByRole('link', { name: 'Research', exact: true }).click();
    await expect(page).toHaveURL(/#research$/);
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Research', exact: true })).toHaveAttribute('aria-current', 'location');
  }
});

test('keyboard skip link and reduced motion work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('clipboard denial explains recovery and mailto stays available', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Denied'); } }, configurable: true });
  });
  await page.goto('/#contact');
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toHaveText('Could not copy. Select the email address, or use the email link.');
  await expect(page.getByRole('link', { name: 'Start a conversation' })).toHaveAttribute('href', 'mailto:huyentonnubaotien@gmail.com');
});

test('copy success is announced', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { (window as Window & { copiedEmail?: string }).copiedEmail = text; } }, configurable: true });
  });
  await page.goto('/#contact');
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toHaveText('Email address copied.');
  expect(await page.evaluate(() => (window as Window & { copiedEmail?: string }).copiedEmail)).toBe('huyentonnubaotien@gmail.com');
});

test('no horizontal overflow, broken assets or browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const failed: string[] = [];
  page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test('capture responsive layout evidence', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `.qa/${testInfo.project.name}-viewport.png`, animations: 'disabled' });
  await page.screenshot({ path: `.qa/${testInfo.project.name}-full.png`, fullPage: true, animations: 'disabled' });
  if (testInfo.project.name !== 'tablet') {
    for (const section of ['research', 'publications', 'contact']) {
      await page.locator(`#${section}`).screenshot({ path: `.qa/redesign/${testInfo.project.name}-${section}.png`, animations: 'disabled' });
    }
  }
});

test('320px narrow viewport handles the long title and email', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('WCAG 2.2 AA automated accessibility scan', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => Promise.all(document.getAnimations().map(animation => animation.finished)));
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
});

test('static content and navigation remain usable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.locator('.publication')).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'Copy email address' })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
