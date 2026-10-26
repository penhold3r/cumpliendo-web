'use client';

import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './CircuitBlock.module.css';

interface CircuitBlockProps {
  name: string;
  rounds: number;
  workSeconds: number;
  restSeconds: number;
  exercises?: { id: string; exerciseName: string }[];
}

export function CircuitBlock({ name, rounds, workSeconds, restSeconds, exercises }: CircuitBlockProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <Text as="h3" variant="lead" className={styles.name}>
          {name}
        </Text>
        <Text variant="body-sm" className={styles.params}>
          {rounds} rounds • {workSeconds}s work × {restSeconds}s rest
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
