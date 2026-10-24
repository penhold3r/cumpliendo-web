import { configure, createStyleSheet } from '@latty-ds/tokens/configure';

/**
 * Google Fonts CSS2 stylesheets. Latty `@import`s these into its token sheet
 * (see "Loading a font from a CDN" in the Latty theming guide), so there is no
 * separate `<link>` tag and no self-hosted `@font-face` to maintain.
 */
const INTER_CDN = 'https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap';
const FUNNEL_DISPLAY_CDN =
  'https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap';

/**
 * Cumpliendo brand theme.
 * Primary indigo #4F46E5 mirrors the React Native app's MD3 primary.
 * `theme: 'system'` matches the RN SettingsContext default.
 */
export const lattyThemeConfig = {
  colors: {
    primary: '#4F46E5',
    secondary: '#5252c5',
    success: '#22c55e',
    warning: '#eeb308',
    error: '#ef4444',
    info: '#0ea5e9',
  },
  font: {
    // fontFamilyPrimary — body copy (Inter, the standard UI sans).
    family: INTER_CDN,
    // fontFamilyHeading — display/h1–h6 variants read this automatically.
    heading: { url: FUNNEL_DISPLAY_CDN, fallback: 'sans-serif' },
  },
  border: {
    radius: '4px',
  },
  theme: 'system',
} as const;

/**
 * Server-rendered token sheet. Injected in the root layout so the very first
 * paint already has the indigo palette (no flash of Latty's default orange).
 */
export const lattyStyleSheet = createStyleSheet(lattyThemeConfig);

/**
 * Runtime theming entry point. Safe to call after hydration to switch brand
 * colours or theme mode; replaces the SSR `<style id="lt-tokens">` contents.
 */
export function initLattyTheme() {
  configure(lattyThemeConfig);
}
