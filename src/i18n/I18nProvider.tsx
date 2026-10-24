'use client';

import { useState } from 'react';
import i18n, { type AppLanguage } from './i18n';

/**
 * Keeps the i18n singleton aligned with the language resolved on the server.
 *
 * `page.tsx` runs in the server-component graph, but translated client
 * components are rendered (and SSR'd) from the client graph, which has its own
 * copy of this module. Passing the resolved language down as a prop is the only
 * way both graphs agree, so the server HTML and the hydration pass always
 * render the same locale.
 *
 * `changeLanguage()` resolves synchronously because every bundle is preloaded,
 * so applying it in the render body fixes the language before children render.
 */
export function I18nProvider({
  language,
  children,
}: {
  language: AppLanguage;
  children: React.ReactNode;
}) {
  // `null` until the server value has been applied, so the first render (SSR
  // included) switches the singleton before any child translates anything.
  const [syncedLanguage, setSyncedLanguage] = useState<AppLanguage | null>(null);

  // Tracked in state rather than a ref so a client-side switch (setAppLanguage)
  // is never reverted by an unrelated re-render: only a *changed* server value
  // is re-applied.
  if (syncedLanguage !== language) {
    setSyncedLanguage(language);
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }

  return <>{children}</>;
}
