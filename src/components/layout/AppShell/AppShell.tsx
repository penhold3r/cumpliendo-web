'use client';

import { useState } from 'react';
import { AppHeader } from '../AppHeader';
import { BottomNavigation } from '../BottomNavigation';
import { TabPager } from '../TabPager';
import styles from './AppShell.module.css';
import type { AppShellProps } from './AppShell.types';

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
