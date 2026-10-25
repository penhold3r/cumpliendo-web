'use client';

import { Avatar, Badge, Button, Divider, List, ListItem, Surface, Text } from '@latty-ds/react';
import { signOut } from 'next-auth/react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { PageToolbar } from '@/components/layout/PageToolbar';
import styles from './Profile.module.css';

/** Formats an ISO timestamp into a short locale date string. */
const formatDate = (iso: string | undefined): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export function Profile() {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const profileUser = user as {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt?: string;
    lastLoginAt?: string;
  };

  return (
    <main className={styles.page}>
      <PageToolbar />

      <div className={styles.shell}>
        <Text as="h1" variant="display-lg" className={styles.title}>
          {t('profile.title')}
        </Text>

        <Surface appearance="outlined" elevation="1" className={styles.card}>
          <div className={styles.avatarWrapper}>
            <Avatar
              src={profileUser.image ?? undefined}
              alt={profileUser.name ?? t('profile.account')}
              size="lg"
            />
          </div>
          <Text as="h2" variant="lead" className={styles.name}>
            {profileUser.name ?? t('profile.account')}
          </Text>
          <Text variant="body-sm" className={styles.email}>
            {profileUser.email ?? '—'}
          </Text>
          <Badge className={styles.syncedBadge}>
            {t('profile.synced')}
          </Badge>

          <Divider className={styles.divider} />

          <List className={styles.list}>
            <ListItem className={styles.listItem}>
              <span className={styles.label}>{t('profile.userId')}</span>
              <span className={styles.value}>{profileUser.id}</span>
            </ListItem>
            <ListItem className={styles.listItem}>
              <span className={styles.label}>{t('profile.email')}</span>
              <span className={styles.value}>{profileUser.email ?? '—'}</span>
            </ListItem>
            <ListItem className={styles.listItem}>
              <span className={styles.label}>{t('profile.memberSince')}</span>
              <span className={styles.value}>
                {formatDate(profileUser.createdAt)}
              </span>
            </ListItem>
            <ListItem className={styles.listItem}>
              <span className={styles.label}>{t('profile.lastLogin')}</span>
              <span className={styles.value}>
                {formatDate(profileUser.lastLoginAt)}
              </span>
            </ListItem>
          </List>

          <Button
            appearance="outlined"
            size="sm"
            fullWidth
            onClick={() => void signOut({ callbackUrl: '/' })}
            className={styles.signOutButton}
          >
            {t('profile.signOut')}
          </Button>
        </Surface>
      </div>
    </main>
  );
}
