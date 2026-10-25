'use client';

import { SessionProvider } from 'next-auth/react';
import { SettingsProvider } from '@/context/SettingsContext';
import { WorkoutProvider } from '@/context/WorkoutContext';

/**
 * Composes all Cumpliendo context providers in the correct order:
 * 1. SessionProvider (NextAuth) — auth session
 * 2. SettingsProvider — units, theme, language
 * 3. WorkoutProvider — exercises, routines, history, stats, active workout
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SettingsProvider>
        <WorkoutProvider>{children}</WorkoutProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}
