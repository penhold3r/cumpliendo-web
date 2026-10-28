'use client';

import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './AmrapBlock.module.css';
import type { AmrapBlockProps } from './AmrapBlock.types';

export function AmrapBlock({ timeCapMinutes, rounds, exercises }: AmrapBlockProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <Text as="h3" variant="h5" className={styles.name}>
          AMRAP
        </Text>
        <Text variant="body-sm" className={styles.params}>
          {timeCapMinutes} min · {rounds} completed rounds
        </Text>
      </div>

      {exercises && exercises.length > 0 && (
        <div className={styles.exercises}>
          {exercises.map(ex => (
            <div key={ex.id} className={styles.exercise}>
              <Text variant="body-sm">{ex.exerciseName}</Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
