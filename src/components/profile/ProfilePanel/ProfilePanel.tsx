'use client';

import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Chip,
  Divider,
  SidePanel,
  Text,
} from '@latty-ds/react';
import { signOut } from 'next-auth/react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext/useSettings.hook';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { WeightUnits } from '@/utils/units';
import styles from './ProfilePanel.module.css';

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
}

const formatDate = (iso: string | undefined): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { units, setUnits } = useSettings();
  const [signOutOpen, setSignOutOpen] = useState(false);

  const profileUser = user as {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt?: string;
    lastLoginAt?: string;
  } | null;

  return (
    <>
      <SidePanel
        open={open}
        onClose={onClose}
        anchor="end"
        size="360px"
        label={t('profile.account')}
        noCloseButton
      >
        {profileUser && (
          <div className={styles.content}>
            <div className={styles.identity}>
              <Avatar
                src={profileUser.image ?? undefined}
                alt={profileUser.name ?? t('profile.account')}
                size="lg"
                color="primary"
              />
              <Text as="h2" variant="h4" className={styles.name}>
                {profileUser.name ?? t('profile.account')}
              </Text>
              <Text variant="body-sm" className={styles.email}>
                {profileUser.email ?? '—'}
              </Text>
              <Badge>{t('profile.synced')}</Badge>
            </div>

            <Divider />

            <div className={styles.section}>
              <Text variant="h6" className={styles.sectionTitle}>
                {t('profile.units')}
              </Text>
              <Text variant="caption" className={styles.hint}>
                {t('profile.unitsHint')}
              </Text>
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

            <Divider />

            <div className={styles.section}>
              <div className={styles.infoRow}>
                <Text variant="caption" className={styles.infoLabel}>
                  {t('profile.memberSince')}
                </Text>
                <Text variant="caption">
                  {formatDate(profileUser.createdAt)}
                </Text>
              </div>
              <div className={styles.infoRow}>
                <Text variant="caption" className={styles.infoLabel}>
                  {t('profile.lastLogin')}
                </Text>
                <Text variant="caption">
                  {formatDate(profileUser.lastLoginAt)}
                </Text>
              </div>
            </div>

            <div className={styles.footer}>
              <Button
                appearance="outlined"
                variant="error"
                size="sm"
                fullWidth
                onClick={() => setSignOutOpen(true)}
              >
                {t('profile.signOut')}
              </Button>
            </div>
          </div>
        )}
      </SidePanel>

      <ConfirmDialog
        open={signOutOpen}
        title={t('profile.signOutTitle')}
        message={t('profile.signOutBody')}
        confirmLabel={t('profile.signOut')}
        onConfirm={() => void signOut({ callbackUrl: '/' })}
        onCancel={() => setSignOutOpen(false)}
      />
    </>
  );
}
