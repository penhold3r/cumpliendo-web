'use client';

import { useState, type ReactNode } from 'react';
import { Nav, NavItem, Text, IconButton } from '@latty-ds/react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './AppHeader.module.css';
import type { AppHeaderProps } from './AppHeader.types';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', route: '/home' },
  { id: 'routines', label: 'Routines', route: '/routines' },
  { id: 'train', label: 'Train', route: '/train' },
  { id: 'history', label: 'History', route: '/history' },
  { id: 'exercises', label: 'Exercises', route: '/exercises' },
] as const;

export function AppHeader({ children }: AppHeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Text as="h1" variant="display-lg" className={styles.logo}>
          Cumpliendo
        </Text>
      </div>

      <Nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            href={item.route}
            className={styles.navItem}
            aria-current={pathname === item.route ? 'page' : undefined}
            onClick={() => router.push(item.route)}
          >
            {item.label}
          </NavItem>
        ))}
      </Nav>

      <div className={styles.actions}>
        {isAuthenticated && user && (
          <IconButton
            icon="user"
            label={`Account: ${user.name}`}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={styles.accountButton}
          />
        )}
      </div>

      {children}
    </header>
  );
}
