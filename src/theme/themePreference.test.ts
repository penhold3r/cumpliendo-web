import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  applyThemeMode,
  isThemeMode,
  readThemeMode,
  setThemeMode,
} from './themePreference';

const storage = window.localStorage as unknown as {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
};

describe('themePreference', () => {
  beforeEach(() => {
    storage.getItem.mockReset().mockReturnValue(null);
    storage.setItem.mockReset();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to system when nothing is stored', () => {
    expect(readThemeMode()).toBe('system');
  });

  it('reads a stored mode', () => {
    storage.getItem.mockReturnValue('dark');
    expect(readThemeMode()).toBe('dark');
  });

  it('ignores values that are not a theme mode', () => {
    storage.getItem.mockReturnValue('neon');
    expect(readThemeMode()).toBe('system');
  });

  it('survives storage throwing', () => {
    storage.getItem.mockImplementation(() => {
      throw new Error('denied');
    });
    expect(readThemeMode()).toBe('system');
  });

  it('validates theme modes', () => {
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('system')).toBe(true);
    expect(isThemeMode('sepia')).toBe(false);
    expect(isThemeMode(null)).toBe(false);
  });

  it('forces light and dark through data-theme', () => {
    applyThemeMode('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    applyThemeMode('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('drops the override for system', () => {
    applyThemeMode('dark');
    applyThemeMode('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('persists before applying', () => {
    setThemeMode('dark');
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
