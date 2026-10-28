'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { AppHeader } from '../AppHeader';
import { BottomNavigation } from '../BottomNavigation';
import { TabPager } from '../TabPager';
import styles from './AppShell.module.css';
import type { AppShellProps } from './AppShell.types';

const TABS = [
  { id: 'home', label: 'Home', route: '/home' },
  { id: 'routines', label: 'Routines', route: '/routines' },
  { id: 'train', label: 'Train', route: '/train' },
  { id: 'history', label: 'History', route: '/history' },
  { id: 'exercises', label: 'Exercises', route: '/exercises' },
] as const;

export function AppShell({ children }: AppShellProps) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className={styles.shell}>
      <AppHeader>
        {/* Header content (logo, nav, actions) is rendered inside AppHeader */}
      </AppHeader>

      <main className={styles.main}>
        <TabPager activeTab={activeTab}>
          {children}
        </TabPager>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
