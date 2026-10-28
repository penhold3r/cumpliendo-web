'use client';

import { Text } from '@latty-ds/react';
import styles from './CircuitBlock.module.css';
import type { CircuitBlockProps } from './CircuitBlock.types';

export function CircuitBlock({ name, rounds, workSeconds, restSeconds, exercises }: CircuitBlockProps) {

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <Text as="h3" variant="h5" className={styles.name}>
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
