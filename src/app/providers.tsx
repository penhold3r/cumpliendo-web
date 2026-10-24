'use client';

import { useEffect } from 'react';
import { initLattyTheme } from '@/theme/lattyConfig';
import { registerCumpliendoIcons } from '@/theme/icons';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initLattyTheme();
    registerCumpliendoIcons();
  }, []);

  return <>{children}</>;
}
