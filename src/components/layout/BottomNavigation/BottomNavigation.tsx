'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Icon, type IconProps } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './BottomNavigation.module.css';
import type { BottomNavigationProps } from './BottomNavigation.types';

const NAV_ITEMS = [
  { id: 'home', labelKey: 'nav.home', icon: 'home', route: '/home' },
  { id: 'routines', labelKey: 'nav.routines', icon: 'menu-book', route: '/routines' },
  { id: 'train', labelKey: 'nav.train', icon: 'timer', route: '/train' },
  { id: 'history', labelKey: 'nav.history', icon: 'history', route: '/history' },
  { id: 'exercises', labelKey: 'nav.exercises', icon: 'list-view', route: '/exercises' },
] as const;

export function BottomNavigation({ activeTab: activeTabProp, onTabChange, className }: BottomNavigationProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = activeTabProp || NAV_ITEMS.find((item) => pathname.startsWith(item.route))?.id || 'home';

  const handleTabClick = (item: (typeof NAV_ITEMS)[number]) => {
    onTabChange?.(item.id);
    router.push(item.route);
  };

  return (
    <nav className={`${styles.bottomNav}${className ? ` ${className}` : ''}`} aria-label={t('nav.main')}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const label = t(item.labelKey);
        return (
          <button
            key={item.id}
            className={styles.navItem}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
            onClick={() => handleTabClick(item)}
          >
            <span className={styles.icon} aria-hidden="true">
              <Icon name={item.icon as IconProps['name']} size="sm" />
            </span>
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
