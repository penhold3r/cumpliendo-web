import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { es } from './locales/es';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from './constants';

export { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, SUPPORTED_LANGUAGES };
export type { AppLanguage };

const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const isAppLanguage = (value: unknown): value is AppLanguage =>
  typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as AppLanguage);

export const getDeviceLanguage = (): AppLanguage => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    const code = locale.split(/[-_]/)[0]?.toLowerCase();
    return SUPPORTED_LANGUAGES.find(l => l === code) ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

/**
 * Pick the best supported language from an `Accept-Language` header
 * (`es-ES,es;q=0.9,en;q=0.8`), honouring q-values.
 */
export const parseAcceptLanguage = (header: string | null | undefined): AppLanguage => {
  if (!header) return DEFAULT_LANGUAGE;

  const ranked = header
    .split(',')
    .map(part => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find(param => param.trim().startsWith('q='));
      const quality = q ? Number.parseFloat(q.split('=')[1] ?? '') : 1;
      return {
        code: tag.split(/[-_]/)[0]?.toLowerCase() ?? '',
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter(entry => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const entry of ranked) {
    if (isAppLanguage(entry.code)) return entry.code;
  }

  return DEFAULT_LANGUAGE;
};

const readCookieLanguage = (): AppLanguage | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LANGUAGE_COOKIE}=([^;]*)`)
  );
  const value = match ? decodeURIComponent(match[1]) : null;
  return isAppLanguage(value) ? value : null;
};

/** Cookie → device → default. Only runs in the browser during hydration. */
export const getInitialLanguage = (): AppLanguage =>
  readCookieLanguage() ?? getDeviceLanguage();

export const getLocaleTag = (): string => (i18n.language === 'en' ? 'en-US' : 'es-ES');

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { es: { translation: es }, en: { translation: en } },
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    returnNull: false,
    initAsync: false,
    react: { useSuspense: false },
  });
}

/**
 * Switch the active language and persist it for the next server render.
 * Used by the language switcher and safe to call from a client component.
 */
export async function setAppLanguage(language: AppLanguage): Promise<void> {
  await i18n.changeLanguage(language);
  if (typeof document === 'undefined') return;
  document.documentElement.lang = language;
  document.cookie = `${LANGUAGE_COOKIE}=${language}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export default i18n;
