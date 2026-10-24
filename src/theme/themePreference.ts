/**
 * Theme mode preference.
 *
 * Latty is configured with `theme: 'system'` (see lattyConfig.ts), which emits
 * light, dark and `prefers-color-scheme` layers in one token sheet. Switching at
 * runtime therefore needs no re-`configure()`: setting `data-theme` on `<html>`
 * forces a mode, and removing it falls back to the OS preference.
 */
export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'cumpliendo:theme';

const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

export const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === 'string' && THEME_MODES.includes(value as ThemeMode);

/** Read the persisted preference. Defaults to `system` when unavailable. */
export function readThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

/** Apply a mode to the document without touching storage. */
export function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', mode);
}

/** Persist a mode and apply it immediately. */
export function setThemeMode(mode: ThemeMode): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Private mode / storage disabled — the visual switch still applies.
  }
  applyThemeMode(mode);
}
