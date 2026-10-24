/**
 * Language constants shared by the server, the client and the pre-hydration
 * bootstrap script. Kept dependency-free so importing them never pulls the
 * i18next runtime into a bundle that only needs the cookie name.
 */
export type AppLanguage = 'es' | 'en';

export const SUPPORTED_LANGUAGES: AppLanguage[] = ['es', 'en'];
export const DEFAULT_LANGUAGE: AppLanguage = 'es';

/**
 * Persisted language. A cookie (not localStorage) is the source of truth so the
 * server can render the first paint in the right language — see page.tsx and
 * the bootstrap script, which read it before paint.
 */
export const LANGUAGE_COOKIE = 'cumpliendo-language';
