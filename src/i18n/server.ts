import { cookies, headers } from 'next/headers';
import {
  LANGUAGE_COOKIE,
  isAppLanguage,
  parseAcceptLanguage,
  type AppLanguage,
} from './i18n';

/**
 * Resolve the language for the current request: the explicit cookie choice
 * first, then the browser's `Accept-Language` header, then the app default.
 * Server-only — never import this from a client component.
 */
export async function getRequestLanguage(): Promise<AppLanguage> {
  const store = await cookies();
  const value = store.get(LANGUAGE_COOKIE)?.value;
  if (isAppLanguage(value)) return value;

  const acceptLanguage = (await headers()).get('accept-language');
  return parseAcceptLanguage(acceptLanguage);
}
