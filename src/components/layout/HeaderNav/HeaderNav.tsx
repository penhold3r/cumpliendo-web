'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Nav, NavItem, Avatar, Button, Dropdown, DropdownItem, Icon, IconButton, type IconProps } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext/useSettings.hook';
import { ProfilePanel } from '@/components/profile/ProfilePanel';
import styles from './HeaderNav.module.css';
import type { HeaderNavProps } from './HeaderNav.types';

const NAV_ITEMS = [
  { id: 'home', labelKey: 'nav.home', route: '/home' },
  { id: 'routines', labelKey: 'nav.routines', route: '/routines' },
  { id: 'history', labelKey: 'nav.history', route: '/history' },
  { id: 'exercises', labelKey: 'nav.exercises', route: '/exercises' },
] as const;

export function HeaderNav({ className }: HeaderNavProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { themeMode, language, setThemeMode, setLanguage } = useSettings();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleNavClick = (route: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(route);
  };

  const langOptions = [
    { value: 'system' as const, label: t('profile.system') },
    { value: 'es' as const, label: 'Español' },
    { value: 'en' as const, label: 'English' },
  ];

  const langDisplay = language === 'es' ? 'ES' : language === 'en' ? 'EN' : 'Auto';

  const themeIcon = themeMode === 'dark'
    ? 'dark-mode'
    : themeMode === 'light'
      ? 'light-mode'
      : 'monitor';

  const themeOptions = [
    { value: 'system' as const, icon: 'monitor', label: t('profile.system') },
    { value: 'light' as const, icon: 'light-mode', label: t('profile.themeLight') },
    { value: 'dark' as const, icon: 'dark-mode', label: t('profile.themeDark') },
  ];

  const isOnTrain = pathname.startsWith('/train');

  return (
    <>
      <header className={`${styles.header} ${className ?? ''}`}>
        <div className={styles.inner}>
          <a href="/home" className={styles.brand} onClick={handleNavClick('/home')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cumpl-logo.svg" alt="" className={styles.brandLogo} aria-hidden="true" />
            <span className={styles.brandName}>CUMPLIENDO</span>
          </a>

          <Nav orientation="horizontal" label={t('nav.main')} className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                href={item.route}
                label={t(item.labelKey)}
                active={pathname.startsWith(item.route)}
                onClick={handleNavClick(item.route)}
              />
            ))}
          </Nav>

          <Button
            variant="primary"
            size="sm"
            className={`${styles.trainCta} ${isOnTrain ? styles.trainCtaActive : ''}`}
            onClick={() => router.push('/train')}
          >
            <Icon name={'fitness-center' as IconProps['name']} size="xs" />
            {t('nav.train')}
          </Button>

          <div className={styles.actions}>
            <Dropdown placement="bottom-end">
              <Button
                slot="trigger"
                variant="neutral"
                appearance="outlined"
                size="sm"
                iconStart={'translate' as IconProps['name']}
                aria-label={t('profile.language')}
              >
                {langDisplay}
              </Button>
              {langOptions.map(opt => (
                <DropdownItem
                  key={opt.value}
                  selected={language === opt.value}
                  onSelect={() => setLanguage(opt.value)}
                >
                  {opt.label}
                </DropdownItem>
              ))}
            </Dropdown>
            <Dropdown placement="bottom-end">
              <IconButton
                slot="trigger"
                icon={themeIcon as IconProps['name']}
                label={t('profile.theme')}
                variant="neutral"
                appearance="outlined"
                size="sm"
                round
              />
              {themeOptions.map(opt => (
                <DropdownItem
                  key={opt.value}
                  selected={themeMode === opt.value}
                  onSelect={() => setThemeMode(opt.value)}
                >
                  <Icon name={opt.icon as IconProps['name']} size="sm" />
                  {opt.label}
                </DropdownItem>
              ))}
            </Dropdown>
            <button
              className={styles.avatarButton}
              onClick={() => setProfileOpen(true)}
              aria-label={t('profile.account')}
            >
              <Avatar
                src={user?.image ?? undefined}
                name={user?.name ?? undefined}
                alt={user?.name ?? t('profile.account')}
                size="sm"
                color="primary"
              />
            </button>
          </div>
        </div>
      </header>

      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
