'use client';

import { Button, Icon, Surface, Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import styles from './History.module.css';

export function History() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Text as="h1" variant="display-lg" className={styles.title}>
          {t('history.title')}
        </Text>
        <Text variant="body-sm" className={styles.subtitle}>
          {t('history.subtitle')}
        </Text>
      </div>

      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">
          <Icon name="clock" size="lg" />
        </span>
        <Text as="h2" variant="lead" className={styles.emptyTitle}>
          {t('history.emptyTitle')}
        </Text>
        <Text variant="body-sm" className={styles.emptyBody}>
          {t('history.emptyBody')}
        </Text>
        <div className={styles.emptyActions}>
          <Button
            variant="primary"
            size="md"
            className={styles.startLive}
            onClick={() => {
              // TODO: navigate to live workout
            }}
          >
            {t('history.startLive')}
          </Button>
          <Button
            appearance="outlined"
            size="md"
            className={styles.logPast}
            onClick={() => {
              // TODO: navigate to log past workout
            }}
          >
            {t('history.logPast')}
          </Button>
        </div>
      </div>
    </div>
  );
}
