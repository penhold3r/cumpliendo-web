import { expect, test } from '@playwright/test';

/**
 * Guards the two regressions that broke the first landing build:
 *   1. Latty tokens were never applied, so the CTA fell back to Latty's
 *      default orange instead of the Cumpliendo indigo.
 *   2. The CSS Module class names came back empty, so the layout collapsed.
 */
test.describe('landing page', () => {
  test('renders the branded sign-in screen with Latty tokens applied', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.locator('lt-text[variant="display-lg"]')).toHaveText(
      'Cumpliendo'
    );

    const button = page.locator('lt-button');
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

    const button = page.locator('lt-button');
    await expect(button).toBeInViewport();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});
