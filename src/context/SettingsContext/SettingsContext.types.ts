import { type AppLanguage } from '@/i18n';
import { type WeightUnits } from '@/utils/units';

export type ThemeMode = 'system' | 'light' | 'dark';

/** 'system' follows the device language (Spanish if unsupported). */
export type LanguageSetting = 'system' | AppLanguage;

export interface AppSettings {
  units: WeightUnits;
  themeMode: ThemeMode;
  language: LanguageSetting;
}

export interface SettingsContextType extends AppSettings {
  setUnits: (units: WeightUnits) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: LanguageSetting) => void;
}
