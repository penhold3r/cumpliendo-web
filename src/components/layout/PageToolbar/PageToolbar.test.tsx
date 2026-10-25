import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '@/i18n';
import { THEME_STORAGE_KEY } from '@/theme/themePreference';
import { PageToolbar } from './PageToolbar';

const storage = window.localStorage as unknown as {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
};

const triggers = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('lt-dropdown > lt-button'));

const items = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('lt-dropdown-item'));

/** lt-dropdown-item dispatches `select` when activated (click / Enter). */
const selectItem = (item: Element) =>
  fireEvent(item, new CustomEvent('select', { detail: { item } }));

const itemByText = (container: HTMLElement, text: string) => {
  const item = items(container).find(el => el.textContent?.trim() === text);
  if (!item) throw new Error(`No menu item "${text}"`);
  return item;
};

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

  it('renders a theme and a language menu trigger', () => {
    const { container } = render(<PageToolbar />);
    const [theme, language] = triggers(container);

    expect(triggers(container)).toHaveLength(2);
    expect(theme).toHaveAttribute('aria-label', 'Tema: Sistema');
    expect(language).toHaveAttribute('aria-label', i18n.t('profile.language'));
    expect(language.textContent).toBe('ES');
  });

  it('lists the theme modes and the languages', () => {
    const { container } = render(<PageToolbar />);
    const labels = items(container).map(item => item.textContent?.trim());

    expect(labels).toEqual(['Sistema', 'Claro', 'Oscuro', 'Español', 'English']);
  });

  it('marks the active theme and language', async () => {
    const { container } = render(<PageToolbar />);

    // `selected` is a reflected Lit property, so it lands one microtask later.
    await vi.waitFor(() => {
      expect(itemByText(container, 'Sistema')).toHaveAttribute('selected');
      expect(itemByText(container, 'Español')).toHaveAttribute('selected');
    });
    expect(itemByText(container, 'Oscuro')).not.toHaveAttribute('selected');
  });

  it('applies and persists the chosen theme', async () => {
    const { container } = render(<PageToolbar />);

    selectItem(itemByText(container, 'Oscuro'));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
    await vi.waitFor(() =>
      expect(itemByText(container, 'Oscuro')).toHaveAttribute('selected')
    );
  });

  it('clears the theme override when system is chosen', () => {
    const { container } = render(<PageToolbar />);

    selectItem(itemByText(container, 'Oscuro'));
    selectItem(itemByText(container, 'Sistema'));

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('switches language, updates <html lang> and stores the cookie', async () => {
    const { container } = render(<PageToolbar />);

    selectItem(itemByText(container, 'English'));

    await vi.waitFor(() => expect(i18n.language).toBe('en'));
    expect(document.documentElement.lang).toBe('en');
    expect(document.cookie).toContain('cumpliendo-language=en');
    expect(itemByText(container, 'English')).toHaveAttribute('selected');
  });
});
