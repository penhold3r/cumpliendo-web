'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './BottomNavigation.module.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home', route: '/home' },
  { id: 'routines', label: 'Routines', icon: 'menu-book', route: '/routines' },
  { id: 'train', label: 'Train', icon: 'timer', route: '/train' },
  { id: 'history', label: 'History', icon: 'history', route: '/history' },
  { id: 'exercises', label: 'Exercises', icon: 'list-view', route: '/exercises' },
] as const;

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (route: string) => void;
}

export function BottomNavigation({ activeTab: activeTabProp, onTabChange }: BottomNavigationProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Derive active tab from URL if not provided as prop.
  const activeTab = activeTabProp || NAV_ITEMS.find((item) => item.route === pathname)?.id || 'home';

  // Prevent flash before hydration.
  useState(() => {
    setMounted(true);
  });

  if (!mounted) {
    return null;
  }

  const handleTabClick = (route: string) => {
    onTabChange?.(route);
    router.push(route);
  };

  return (
    <nav className={styles.bottomNav} aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={styles.navItem}
            aria-selected={isActive}
            aria-label={`${item.label}${isActive ? ', current' : ''}`}
            onClick={() => handleTabClick(item.route)}
          >
            <span className={styles.icon} aria-hidden="true">
              <span className={styles.iconLabel}>{item.label.charAt(0)}</span>
            </span>
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

