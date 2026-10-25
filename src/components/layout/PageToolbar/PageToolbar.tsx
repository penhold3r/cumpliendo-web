'use client';

import { useLayoutEffect, useState } from 'react';
import { Button, Dropdown, DropdownItem, Icon } from '@latty-ds/react';
import {
  DEFAULT_LANGUAGE,
  isAppLanguage,
  setAppLanguage,
  useTranslation,
  type AppLanguage,
} from '@/i18n';
import {
  applyThemeMode,
  readThemeMode,
  setThemeMode,
  type ThemeMode,
} from '@/theme/themePreference';
import styles from './PageToolbar.module.css';

/** Icon, label key and menu order for the three theme modes. */
const THEME_OPTIONS = [
  { value: 'system', icon: 'monitor', labelKey: 'profile.system' },
  { value: 'light', icon: 'sun', labelKey: 'profile.themeLight' },
  { value: 'dark', icon: 'moon', labelKey: 'profile.themeDark' },
] as const;

/** Language names stay in their own language, as is conventional. */
const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
] as const;

const LANGUAGE_CODES: Record<AppLanguage, string> = { es: 'ES', en: 'EN' };

/**
 * Page-level preferences: theme mode and language, as two compact menus in the
 * top-right corner. Both persist across reloads (localStorage for theme, cookie
 * for language so the server can render the first paint in the right locale).
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
  const currentTheme = THEME_OPTIONS.find(option => option.value === themeMode);

  const chooseTheme = (value: ThemeMode) => {
    setThemeModeState(value);
    setThemeMode(value);
  };

  const chooseLanguage = (value: AppLanguage) => {
    void setAppLanguage(value);
  };

  return (
    <div className={styles.toolbar}>
      <Dropdown placement="bottom-end">
        <Button
          slot="trigger"
          variant="neutral"
          appearance="outlined"
          size="sm"
          iconStart={currentTheme?.icon ?? 'monitor'}
          aria-label={`${t('profile.theme')}: ${t(
            currentTheme?.labelKey ?? 'profile.system'
          )}`}
        />
        {THEME_OPTIONS.map(option => (
          <DropdownItem
            key={option.value}
            selected={themeMode === option.value}
            onSelect={() => chooseTheme(option.value)}
          >
            <Icon name={option.icon} size="sm" />
            {t(option.labelKey)}
          </DropdownItem>
        ))}
      </Dropdown>

      <Dropdown placement="bottom-end">
        <Button
          slot="trigger"
          variant="neutral"
          appearance="outlined"
          size="sm"
          iconStart="globe"
          aria-label={t('profile.language')}
        >
          {LANGUAGE_CODES[language]}
        </Button>
        {LANGUAGE_OPTIONS.map(option => (
          <DropdownItem
            key={option.value}
            selected={language === option.value}
            onSelect={() => chooseLanguage(option.value)}
          >
            {option.label}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}
