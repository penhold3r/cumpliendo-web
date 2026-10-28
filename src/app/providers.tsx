'use client';

import { SessionProvider } from 'next-auth/react';
import { SettingsProvider } from '@/context/SettingsContext';
import { WorkoutProvider } from '@/context/WorkoutContext';
import { registerCumpliendoIcons } from '@/theme/icons';

registerCumpliendoIcons();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SettingsProvider>
        <WorkoutProvider>{children}</WorkoutProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}
