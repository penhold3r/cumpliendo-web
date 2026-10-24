'use client';

import { useEffect } from 'react';
import '@latty-ds/web';
import '@latty-ds/web/css/latty.css';
import '@latty-ds/icons';
import { initLattyTheme } from '@/theme/lattyConfig';
import { registerCumpliendoIcons } from '@/theme/icons';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initLattyTheme();
    registerCumpliendoIcons();
  }, []);

  return <>{children}</>;
}
