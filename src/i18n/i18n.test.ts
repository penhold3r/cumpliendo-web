import { describe, expect, it } from 'vitest';
import { DEFAULT_LANGUAGE, isAppLanguage, parseAcceptLanguage } from './i18n';

describe('parseAcceptLanguage', () => {
  it('falls back to the default without a header', () => {
    expect(parseAcceptLanguage(null)).toBe(DEFAULT_LANGUAGE);
    expect(parseAcceptLanguage(undefined)).toBe(DEFAULT_LANGUAGE);
    expect(parseAcceptLanguage('')).toBe(DEFAULT_LANGUAGE);
  });

  it('picks a supported language from the header', () => {
    expect(parseAcceptLanguage('en-US,en;q=0.9')).toBe('en');
    expect(parseAcceptLanguage('es-ES,es;q=0.9,en;q=0.8')).toBe('es');
  });

  it('honours q-values', () => {
    expect(parseAcceptLanguage('es;q=0.3,en;q=0.8')).toBe('en');
    expect(parseAcceptLanguage('en;q=0.2,es;q=0.7')).toBe('es');
  });

  it('skips unsupported languages and q=0 entries', () => {
    expect(parseAcceptLanguage('fr-FR,fr;q=0.9,en;q=0.5')).toBe('en');
    expect(parseAcceptLanguage('en;q=0,es;q=0.4')).toBe('es');
  });

  it('falls back when nothing is supported', () => {
    expect(parseAcceptLanguage('fr-FR,de;q=0.8')).toBe(DEFAULT_LANGUAGE);
  });
});

describe('isAppLanguage', () => {
  it('only accepts supported language codes', () => {
    expect(isAppLanguage('es')).toBe(true);
    expect(isAppLanguage('en')).toBe(true);
    expect(isAppLanguage('en-US')).toBe(false);
    expect(isAppLanguage(undefined)).toBe(false);
  });
});
