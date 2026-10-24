import { LandingPage } from '@/components/landing/LandingPage';
import { I18nProvider } from '@/i18n/I18nProvider';
import { getRequestLanguage } from '@/i18n/server';

/**
 * The landing page is the auth gate. It renders language-specific copy on the
 * server, so it blocks on the request cookie instead of streaming a static
 * shell — an empty shell would flash the wrong language.
 */
export const instant = false;

export default async function HomePage() {
  const language = await getRequestLanguage();

  return (
    <I18nProvider language={language}>
      <LandingPage />
    </I18nProvider>
  );
}
