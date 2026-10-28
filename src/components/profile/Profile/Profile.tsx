'use client';

import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Chip,
  Surface,
  Text,
} from '@latty-ds/react';
import { signOut } from 'next-auth/react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext/useSettings.hook';
import { useWorkout } from '@/context/WorkoutContext';
import { useUnits } from '@/context/SettingsContext/useUnits.hook';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { WeightUnits } from '@/utils/units';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import styles from './Profile.module.css';

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
  const { units, setUnits } = useSettings();
  const { state } = useWorkout();
  const { toDisplay, unitLabel } = useUnits();
  const [signOutOpen, setSignOutOpen] = useState(false);

  if (isLoading || !isAuthenticated || !user) {
    return <PageSkeleton variant="profile" />;
  }

  const profileUser = user as {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt?: string;
    lastLoginAt?: string;
  };

  const { stats } = state;

  return (
    <main className={styles.page}>
      <div className={styles.grid}>
        {/* Left column: identity + stats */}
        <div className={styles.column}>
          <Surface appearance="outlined" className={styles.card}>
            <div className={styles.cardInner}>
              <div className={styles.identity}>
                <Avatar
                  src={profileUser.image ?? undefined}
                  alt={profileUser.name ?? t('profile.account')}
                  size="lg"
                />
                <Text as="h2" variant="h4" className={styles.name}>
                  {profileUser.name ?? t('profile.account')}
                </Text>
                <Text variant="body-sm" className={styles.email}>
                  {profileUser.email ?? '—'}
                </Text>
                <Badge className={styles.syncedBadge}>
                  {t('profile.synced')}
                </Badge>
              </div>
            </div>
          </Surface>

          <Surface appearance="outlined" className={styles.card}>
            <div className={styles.cardInner}>
              <div className={styles.statsGrid}>
                <div className={styles.statCell}>
                  <Text variant="h4" className={styles.statValue}>
                    {stats.totalWorkouts}
                  </Text>
                  <Text variant="caption" className={styles.statLabel}>
                    {t('profile.sessions')}
                  </Text>
                </div>
                <div className={styles.statCell}>
                  <Text variant="h4" className={styles.statValue}>
                    {stats.currentStreak}
                  </Text>
                  <Text variant="caption" className={styles.statLabel}>
                    {t('profile.streak')}
                  </Text>
                </div>
                <div className={styles.statCell}>
                  <Text variant="h4" className={styles.statValue}>
                    {stats.bestStreak}
                  </Text>
                  <Text variant="caption" className={styles.statLabel}>
                    {t('profile.bestStreak')}
                  </Text>
                </div>
                <div className={styles.statCell}>
                  <Text variant="h4" className={styles.statValue}>
                    {Math.round(toDisplay(stats.totalVolumeKg)).toLocaleString()}
                  </Text>
                  <Text variant="caption" className={styles.statLabel}>
                    {t('profile.volume')} ({unitLabel})
                  </Text>
                </div>
              </div>
            </div>
          </Surface>
        </div>

        {/* Right column: preferences + account info + sign out */}
        <div className={styles.column}>
          <Surface appearance="outlined" className={styles.card}>
            <div className={styles.cardInner}>
              <Text as="h3" variant="h4" className={styles.sectionTitle}>
                {t('profile.preferences')}
              </Text>

              <div className={styles.prefRow}>
                <div className={styles.prefLabel}>
                  <Text variant="body">{t('profile.units')}</Text>
                  <Text variant="caption" className={styles.prefHint}>
                    {t('profile.unitsHint')}
                  </Text>
                </div>
                <div className={styles.chipGroup}>
                  {(['metric', 'imperial'] as WeightUnits[]).map(u => (
                    <Chip
                      key={u}
                      selected={units === u}
                      onClick={() => setUnits(u)}
                      size="sm"
                    >
                      {t(u === 'metric' ? 'profile.unitsMetric' : 'profile.unitsImperial')}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </Surface>

          <Surface appearance="outlined" className={styles.card}>
            <div className={styles.cardInner}>
              <div className={styles.infoRow}>
                <Text variant="body-sm" className={styles.infoLabel}>
                  {t('profile.memberSince')}
                </Text>
                <Text variant="body-sm">
                  {formatDate(profileUser.createdAt)}
                </Text>
              </div>
              <div className={styles.infoRow}>
                <Text variant="body-sm" className={styles.infoLabel}>
                  {t('profile.lastLogin')}
                </Text>
                <Text variant="body-sm">
                  {formatDate(profileUser.lastLoginAt)}
                </Text>
              </div>
            </div>
          </Surface>

          <Button
            appearance="outlined"
            variant="error"
            size="md"
            fullWidth
            onClick={() => setSignOutOpen(true)}
          >
            {t('profile.signOut')}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={signOutOpen}
        title={t('profile.signOutTitle')}
        message={t('profile.signOutBody')}
        confirmLabel={t('profile.signOut')}
        onConfirm={() => void signOut({ callbackUrl: '/' })}
        onCancel={() => setSignOutOpen(false)}
      />
    </main>
  );
}
