import { expect, test } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3001';

test.describe('history page', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'cumpliendo-language', value: 'es', url: BASE_URL },
    ]);
  });

  test('redirects unauthenticated users from /history to /', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/history');

    await expect(page).toHaveURL('/');
    await expect(page.locator('lt-button', { hasText: 'Google' })).toBeVisible();
  });
});
