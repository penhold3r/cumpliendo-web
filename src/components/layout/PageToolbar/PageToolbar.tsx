'use client';

import { useLayoutEffect, useState } from 'react';
import { Select } from '@latty-ds/react';
import {
  DEFAULT_LANGUAGE,
  isAppLanguage,
  setAppLanguage,
  useTranslation,
} from '@/i18n';
import {
  applyThemeMode,
  isThemeMode,
  readThemeMode,
  setThemeMode,
  type ThemeMode,
} from '@/theme/themePreference';
import styles from './PageToolbar.module.css';

const themeIcon: Record<ThemeMode, string> = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor',
};

const readSelectValue = (value: string | string[]): string =>
  Array.isArray(value) ? (value[0] ?? '') : value;

/**
 * Page-level preferences: theme mode and language. Both persist across reloads
 * (localStorage for theme, cookie for language so the server can render the
 * first paint in the right locale).
 */
export function PageToolbar() {
  const { t, i18n } = useTranslation();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(readThemeMode);

  // Re-apply after mount: the inline <head> script already ran, but this keeps
  // the DOM in sync with React state (and with other tabs' changes).
  useLayoutEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  const language = isAppLanguage(i18n.language) ? i18n.language : DEFAULT_LANGUAGE;

  const handleThemeChange = (event: CustomEvent<{ value: string | string[] }>) => {
    const next = readSelectValue(event.detail.value);
    if (!isThemeMode(next)) return;
    setThemeModeState(next);
    setThemeMode(next);
  };

  const handleLanguageChange = (event: CustomEvent<{ value: string | string[] }>) => {
    const next = readSelectValue(event.detail.value);
    if (!isAppLanguage(next)) return;
    void setAppLanguage(next);
  };

  return (
    <div className={styles.toolbar}>
      <Select
        className={styles.select}
        size="sm"
        aria-label={t('profile.theme')}
        value={themeMode}
        onChange={handleThemeChange}
        options={[
          { value: 'system', label: t('profile.system'), icon: themeIcon.system },
          { value: 'light', label: t('profile.themeLight'), icon: themeIcon.light },
          { value: 'dark', label: t('profile.themeDark'), icon: themeIcon.dark },
        ]}
      />
      <Select
        className={styles.select}
        size="sm"
        aria-label={t('profile.language')}
        value={language}
        onChange={handleLanguageChange}
        options={[
          { value: 'es', label: 'Español', icon: 'globe' },
          { value: 'en', label: 'English', icon: 'globe' },
        ]}
      />
    </div>
  );
}
