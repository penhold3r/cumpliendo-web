import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '@/i18n';
import { THEME_STORAGE_KEY } from '@/theme/themePreference';
import { PageToolbar } from './PageToolbar';

const storage = window.localStorage as unknown as {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
};

const changeSelect = (select: Element, value: string) => {
  fireEvent(select, new CustomEvent('change', { detail: { value } }));
};

const selects = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('lt-select'));

describe('PageToolbar', () => {
  beforeEach(async () => {
    storage.getItem.mockReset().mockReturnValue(null);
    storage.setItem.mockReset();
    document.documentElement.removeAttribute('data-theme');
    document.cookie = 'cumpliendo-language=; path=/; max-age=0';
    await i18n.changeLanguage('es');
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('renders a theme and a language selector', () => {
    const { container } = render(<PageToolbar />);
    const [theme, language] = selects(container);

    expect(selects(container)).toHaveLength(2);
    expect(theme).toHaveAttribute('aria-label', i18n.t('profile.theme'));
    expect(language).toHaveAttribute('aria-label', i18n.t('profile.language'));
    expect(language).toHaveProperty('value', 'es');
  });

  it('applies and persists the chosen theme', () => {
    const { container } = render(<PageToolbar />);

    changeSelect(selects(container)[0], 'dark');

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
  });

  it('clears the theme override when system is chosen', () => {
    const { container } = render(<PageToolbar />);

    changeSelect(selects(container)[0], 'dark');
    changeSelect(selects(container)[0], 'system');

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('ignores values that are not theme modes', () => {
    const { container } = render(<PageToolbar />);

    changeSelect(selects(container)[0], 'sepia');

    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('switches language, updates <html lang> and stores the cookie', async () => {
    const { container } = render(<PageToolbar />);

    changeSelect(selects(container)[1], 'en');

    await vi.waitFor(() => expect(i18n.language).toBe('en'));
    expect(document.documentElement.lang).toBe('en');
    expect(document.cookie).toContain('cumpliendo-language=en');
  });

  it('ignores unsupported languages', async () => {
    const { container } = render(<PageToolbar />);

    changeSelect(selects(container)[1], 'fr');

    await Promise.resolve();
    expect(i18n.language).toBe('es');
  });
});
