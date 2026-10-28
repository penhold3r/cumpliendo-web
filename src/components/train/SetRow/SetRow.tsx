'use client';

import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './SetRow.module.css';
import type { SetRowProps } from './SetRow.types';

export function SetRow({
  setNumber,
  weightKg,
  reps,
  completed,
  onToggleComplete,
  onWeightChange,
  onRepsChange,
}: SetRowProps) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.row} ${completed ? styles.completed : ''}`}>
      <span className={styles.setNumber}>{setNumber}</span>
      <input
        type="number"
        className={styles.input}
        value={weightKg}
        onChange={e => onWeightChange?.(Number(e.target.value))}
        aria-label="Weight"
      />
      <input
        type="number"
        className={styles.input}
        value={reps}
        onChange={e => onRepsChange?.(Number(e.target.value))}
        aria-label="Reps"
      />
      <button
        className={`${styles.completeButton} ${completed ? styles.completed : ''}`}
        onClick={onToggleComplete}
        aria-label="Complete"
      >
        {completed ? '✓' : '○'}
      </button>
    </div>
  );
}
