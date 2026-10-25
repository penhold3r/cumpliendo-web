'use client';

import { Icon, Surface, Text } from '@latty-ds/react';
import { useTranslation, exerciseName } from '@/i18n';
import { INITIAL_EXERCISES } from '@/data/exercises';
import { type Exercise } from '@/types';
import { useAuth } from '@/context/AuthContext';
import styles from './Exercises.module.css';

export function Exercises() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.list}>
      <Text as="h1" variant="display-lg" className={styles.title}>
        {t('exercises.title')}
      </Text>
      <Text variant="body-sm" className={styles.subtitle}>
        {t('exercises.subtitle')}
      </Text>

      {INITIAL_EXERCISES.map((exercise: Exercise) => (
        <Surface
          key={exercise.id}
          appearance="outlined"
          elevation="1"
          className={styles.card}
        >
          <div className={styles.cardBody}>
            <div className={styles.header}>
              <Text as="h2" variant="lead" className={styles.name}>
                {exerciseName(exercise.id, exercise.name)}
              </Text>
              <span className={styles.category}>{exercise.category}</span>
            </div>
            <Text variant="body-sm" className={styles.description}>
              {exercise.description}
            </Text>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <Icon name="activity" size="sm" /> {exercise.equipment}
              </span>
            </div>
          </div>
        </Surface>
      ))}
    </div>
  );
}
