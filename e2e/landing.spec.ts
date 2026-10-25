import { expect, test } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3001';

/**
 * Guards the regressions that broke the first landing build:
 *   1. Latty tokens were never applied, so the CTA fell back to Latty's
 *      default orange instead of the Cumpliendo indigo.
 *   2. The CSS Module class names came back empty, so the layout collapsed.
 *   3. The server and the client disagreed on the language, so the SSR HTML
 *      was frozen in the build machine's locale.
 */
test.describe('landing page', () => {
  // Pin the language so copy assertions do not depend on the runner's locale.
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'cumpliendo-language', value: 'en', url: BASE_URL },
    ]);
  });

  test('renders the branded sign-in screen with Latty tokens applied', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    await expect(page.locator('lt-text[variant="display-lg"]')).toHaveText(
      'Cumpliendo'
    );

    const button = page.locator('lt-button', { hasText: 'Google' });
    await expect(button).toContainText('Continue with Google');

    const buttonFill = await button.evaluate(el => {
      const inner = el.shadowRoot?.querySelector('[part="base"]');
      return inner ? getComputedStyle(inner).backgroundColor : null;
    });
    expect(buttonFill).toBe('rgb(79, 70, 229)');

    const pagePadding = await page
      .locator('main')
      .evaluate(el => getComputedStyle(el).padding);
    expect(pagePadding).toBe('32px 24px');
  });

  test('keeps the call to action above the fold on a phone', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const button = page.locator('lt-button', { hasText: 'Google' });
    await expect(button).toBeInViewport();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });

  test('server-renders the language cookie, not the runner locale', async ({
    request,
  }) => {
    const response = await request.get('/', {
      headers: {
        cookie: 'cumpliendo-language=es',
        'accept-language': 'en-US,en;q=0.9',
      },
    });
    const html = await response.text();

    expect(html).toContain('<html lang="es"');
    expect(html).toContain('Continuar con Google');
  });

  test('uses the Accept-Language header on a first visit', async ({ request }) => {
    const response = await request.get('/', {
      headers: { 'accept-language': 'es-ES,es;q=0.9' },
    });

    expect(await response.text()).toContain('<html lang="es"');
  });

  test('applies the stored theme before the first paint', async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem('cumpliendo:theme', 'dark')
    );
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('switches theme and language from the top-right toolbar', async ({
    page,
  }) => {
    await page.goto('/');

    const themeMenu = page.locator('lt-dropdown').first();
    await themeMenu.locator('lt-button').click();
    await page.getByRole('menuitem', { name: 'Dark' }).click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('cumpliendo:theme')))
      .toBe('dark');

    const languageMenu = page.locator('lt-dropdown').nth(1);
    await languageMenu.locator('lt-button').click();
    await page.getByRole('menuitem', { name: 'Español' }).click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    const cta = page.locator('lt-button', { hasText: 'Google' });
    await expect(cta).toContainText('Continuar con Google');

    // Both preferences survive a reload (theme via localStorage, language via
    // the cookie read during SSR).
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(cta).toContainText('Continuar con Google');
  });

  test('loads the body and heading fonts from the CDN', async ({ page }) => {
    await page.goto('/');

    // Playwright pierces the shadow DOM, so the inner <h1> is addressable and
    // waiting on it also waits for the custom element to upgrade.
    const heading = page.locator('lt-text[variant="display-lg"] h1');
    await expect(heading).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    const headingFont = await heading.evaluate(
      el => getComputedStyle(el).fontFamily
    );
    const { bodyFont, bodyLoaded, headingLoaded } = await page.evaluate(() => ({
      bodyFont: getComputedStyle(document.body).fontFamily,
      bodyLoaded: document.fonts.check('400 1rem "Inter"'),
      headingLoaded: document.fonts.check('600 1rem "Funnel Display"'),
    }));

    expect(bodyFont).toContain('Inter');
    expect(headingFont).toContain('Funnel Display');
    expect(bodyLoaded).toBe(true);
    expect(headingLoaded).toBe(true);
  });

  test('shows only theme and language dropdowns when unauthenticated', async ({
    page,
  }) => {
    await page.goto('/');

    // Unauthenticated: only theme + language dropdowns, no account dropdown.
    const dropdownTriggers = page.locator('lt-dropdown > lt-button');
    await expect(dropdownTriggers).toHaveCount(2);

    // No account/email text or sign-out option should be present.
    await expect(page.getByText(/@example\.com/)).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: /Cerrar sesión|Sign out/ })
    ).not.toBeVisible();
  });
});
