'use client';

import { Button, Icon, Surface, Text } from '@latty-ds/react';
import { useTranslation, routineText } from '@/i18n';
import { DEFAULT_STARTER_ROUTINES } from '@/data/routines';
import { type Routine } from '@/types';
import { useAuth } from '@/context/AuthContext';
import styles from './Routines.module.css';

/** Translates a starter routine's name/description via i18n, falling back to stored text. */
const routineLabel = (routine: Routine, field: 'name' | 'description') =>
  routineText(routine.id, field, routine[field]);

export function Routines() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  if (DEFAULT_STARTER_ROUTINES.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">
          <Icon name="clipboard" size="lg" />
        </span>
        <Text as="h2" variant="lead" className={styles.emptyTitle}>
          {t('routines.emptyTitle')}
        </Text>
        <Text variant="body-sm" className={styles.emptyBody}>
          {t('routines.emptyBody')}
        </Text>
        <Button variant="primary" size="md" fullWidth className={styles.emptyAction}>
          {t('routines.createFirst')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <Text as="h1" variant="display-lg" className={styles.title}>
        {t('routines.title')}
      </Text>
      <Text variant="body-sm" className={styles.subtitle}>
        {t('routines.subtitle')}
      </Text>

      {DEFAULT_STARTER_ROUTINES.map(routine => (
        <Surface
          key={routine.id}
          appearance="outlined"
          elevation="1"
          className={styles.card}
        >
          <div className={styles.cardBody}>
            <div className={styles.header}>
              <Text as="h2" variant="lead" className={styles.name}>
                {routineLabel(routine, 'name')}
              </Text>
              <span className={styles.estimated}>
                {t('routineCard.estimated', { n: routine.estimatedMinutes })}
              </span>
            </div>
            <Text variant="body-sm" className={styles.description}>
              {routineLabel(routine, 'description')}
            </Text>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <Icon name="activity" size="sm" /> {routine.exercises.length}
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => {
                // TODO: navigate to active workout for this routine
              }}
            >
              {t('routineCard.start')}
            </Button>
          </div>
        </Surface>
      ))}
    </div>
  );
}
