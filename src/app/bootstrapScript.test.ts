import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BOOTSTRAP_SCRIPT } from './bootstrapScript';

const storage = window.localStorage as unknown as {
  getItem: ReturnType<typeof vi.fn>;
};

const runBootstrap = () => new Function(BOOTSTRAP_SCRIPT)();

describe('BOOTSTRAP_SCRIPT', () => {
  beforeEach(() => {
    storage.getItem.mockReset().mockReturnValue(null);
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.lang = 'es';
    document.cookie = 'cumpliendo-language=; path=/; max-age=0';
  });

  it('applies the stored theme before paint', () => {
    storage.getItem.mockReturnValue('dark');

    runBootstrap();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('falls back to the OS preference when no theme is stored', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    runBootstrap();

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('applies the language cookie to <html lang>', () => {
    document.cookie = 'cumpliendo-language=en; path=/';

    runBootstrap();

    expect(document.documentElement.lang).toBe('en');
  });

  it('leaves the default language when there is no cookie', () => {
    runBootstrap();

    expect(document.documentElement.lang).toBe('es');
  });

  it('survives storage and cookie access throwing', () => {
    storage.getItem.mockImplementation(() => {
      throw new Error('denied');
    });
    const cookieSpy = vi
      .spyOn(document, 'cookie', 'get')
      .mockImplementation(() => {
        throw new Error('denied');
      });

    expect(() => runBootstrap()).not.toThrow();

    cookieSpy.mockRestore();
  });
});
