import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { es } from './locales/es';

export type AppLanguage = 'es' | 'en';
export const SUPPORTED_LANGUAGES: AppLanguage[] = ['es', 'en'];
export const DEFAULT_LANGUAGE: AppLanguage = 'es';

export const getDeviceLanguage = (): AppLanguage => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    const code = locale.split(/[-_]/)[0]?.toLowerCase();
    return SUPPORTED_LANGUAGES.find(l => l === code) ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export const getLocaleTag = (): string =>
  i18n.language === 'en' ? 'en-US' : 'es-ES';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { es: { translation: es }, en: { translation: en } },
    lng: getDeviceLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    returnNull: false,
    initAsync: false,
    react: { useSuspense: false },
  });
}

export default i18n;
