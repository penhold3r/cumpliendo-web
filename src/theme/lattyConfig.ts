import { configure, createStyleSheet } from '@latty-ds/tokens/configure';

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
    // fontFamilyPrimary — body copy
    family: '"FunnelDisplay", system-ui, sans-serif',
    // fontFamilyHeading — lt-text heading/display variants read this automatically
    heading: '"FunnelDisplay", system-ui, sans-serif',
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
