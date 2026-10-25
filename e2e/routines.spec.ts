import { expect, test } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3001';

test.describe('routines page', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'cumpliendo-language', value: 'es', url: BASE_URL },
    ]);
  });

  test('redirects unauthenticated users from /routines to /', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/routines');

    await expect(page).toHaveURL('/');
    await expect(page.locator('lt-button', { hasText: 'Google' })).toBeVisible();
  });

  test('landing page renders correctly after redirect (desktop)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    await page.screenshot({
      path: 'e2e-screenshots/landing-desktop.png',
      fullPage: true,
    });

    await expect(page.locator('lt-text[variant="display-lg"]')).toHaveText(
      'Cumpliendo'
    );
    await expect(
      page.locator('lt-button', { hasText: 'Google' })
    ).toBeVisible();
  });

  test('landing page renders correctly (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.screenshot({
      path: 'e2e-screenshots/landing-mobile.png',
      fullPage: true,
    });

    const cta = page.locator('lt-button', { hasText: 'Google' });
    await expect(cta).toBeInViewport();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});
