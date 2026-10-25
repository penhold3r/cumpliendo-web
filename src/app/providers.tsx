'use client';

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

import '@latty-ds/tokens/tokens.css';
import '@latty-ds/tokens/semantic.css';
import '@latty-ds/web/css/latty.css';
import '@latty-ds/web';
import '@latty-ds/icons';
import { initLattyTheme } from '@/theme/lattyConfig';
import { registerCumpliendoIcons } from '@/theme/icons';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initLattyTheme();
    registerCumpliendoIcons();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
