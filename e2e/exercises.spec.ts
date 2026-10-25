import { expect, test } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3001';

test.describe('exercises page', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'cumpliendo-language', value: 'es', url: BASE_URL },
    ]);
  });

  test('redirects unauthenticated users from /exercises to /', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/exercises');

    await expect(page).toHaveURL('/');
    await expect(page.locator('lt-button', { hasText: 'Google' })).toBeVisible();
  });

  test('exercises page renders correctly (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/exercises');

    await page.screenshot({
      path: 'e2e-screenshots/exercises-desktop.png',
      fullPage: true,
    });
  });

  test('exercises page renders correctly (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/exercises');

    await page.screenshot({
      path: 'e2e-screenshots/exercises-mobile.png',
      fullPage: true,
    });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});
