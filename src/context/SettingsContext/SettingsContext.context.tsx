import React from 'react';
import { STORAGE_KEYS } from '@/constants';
import { THEME_STORAGE_KEY } from '@/theme/themePreference';
import { getDeviceLanguage, i18n } from '@/i18n';
import { type WeightUnits } from '@/utils/units';
import { DEFAULT_SETTINGS } from './SettingsContext.state';
import {
  type AppSettings,
  type LanguageSetting,
  type SettingsContextType,
  type ThemeMode,
} from './SettingsContext.types';

/** 'system' → device language (or Spanish if unsupported). */
const resolveLanguage = (language: LanguageSetting) =>
  language === 'system' ? getDeviceLanguage() : language;

export const SettingsContext = React.createContext<
  SettingsContextType | undefined
>(undefined);

/** Device preferences saved in localStorage (survives logout). */
export function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = React.useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load preferences and apply language before mounting app so initial
  // screen displays in chosen language and theme (preventing device-locale flash).
  React.useEffect(() => {
    const load = async () => {
      let loaded = DEFAULT_SETTINGS;
      try {
        const stored = window.localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (stored) {
          loaded = {
            ...DEFAULT_SETTINGS,
            ...(JSON.parse(stored) as Partial<AppSettings>),
          };
          setSettings(loaded);
        }
      } catch (e) {
        console.warn('Could not load preferences', e);
      }
      try {
        await i18n.changeLanguage(resolveLanguage(loaded.language));
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  // Apply subsequent language updates.
  React.useEffect(() => {
    const target = resolveLanguage(settings.language);
    if (i18n.language !== target) {
      i18n.changeLanguage(target);
    }
  }, [settings.language]);

  // Apply theme mode to <html> data-theme attribute and sync to the
  // bootstrap storage key so the next page load picks up the choice
  // before React hydrates (prevents a flash of the wrong palette).
  React.useEffect(() => {
    if (settings.themeMode === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', settings.themeMode);
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, settings.themeMode);
    } catch { /* storage disabled */ }
  }, [settings.themeMode]);

  const update = React.useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(
          STORAGE_KEYS.SETTINGS,
          JSON.stringify(next),
        );
      } catch (e) {
        console.warn('Could not save preferences', e);
      }
      return next;
    });
  }, []);

  const value = React.useMemo<SettingsContextType>(
    () => ({
      ...settings,
      setUnits: (units: WeightUnits) => update({ units }),
      setThemeMode: (themeMode: ThemeMode) => update({ themeMode }),
      setLanguage: (language: LanguageSetting) => update({ language }),
    }),
    [settings, update],
  );

  return (
    <SettingsContext.Provider value={value}>
      {isLoaded ? children : null}
    </SettingsContext.Provider>
  );
}
