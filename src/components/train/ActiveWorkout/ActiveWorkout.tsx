'use client';

import { Button, Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import { SetRow } from '../SetRow';
import styles from './ActiveWorkout.module.css';
import type { ActiveWorkoutProps } from './ActiveWorkout.types';

export function ActiveWorkout({
  activeWorkout,
  workoutDuration,
  onAddExercise,
  onFinish,
  onCancel,
  onToggleSetComplete,
  onUpdateSet,
}: ActiveWorkoutProps) {
  const { t } = useTranslation();

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.activeWorkout}>
      <div className={styles.header}>
        <Text as="h1" variant="display-lg" className={styles.title}>
          {activeWorkout.routineName}
        </Text>
        <Text variant="body-sm" className={styles.subtitle}>
          {activeWorkout.exercises.length} exercises · {activeWorkout.totalSets} sets · {formatTime(workoutDuration)}
        </Text>
      </div>

      <div className={styles.exercises}>
        {activeWorkout.exercises.map(exercise => (
          <div key={exercise.id} className={styles.exerciseCard}>
            <Text as="h2" variant="h4" className={styles.exerciseName}>
              {exercise.exerciseName}
            </Text>
            <div className={styles.sets}>
              <div className={styles.setHeader}>
                <span className={styles.setHeaderCell}>Set</span>
                <span className={styles.setHeaderCell}>Weight</span>
                <span className={styles.setHeaderCell}>Reps</span>
                <span className={styles.setHeaderCell}>Done</span>
              </div>
              {exercise.sets.map(set => (
                <SetRow
                  key={set.id}
                  setNumber={set.setNumber}
                  weightKg={set.weightKg}
                  reps={set.reps}
                  completed={set.completed}
                  onToggleComplete={() => onToggleSetComplete?.(exercise.id, set.id)}
                  onWeightChange={value => onUpdateSet?.(exercise.id, set.id, { weightKg: value })}
                  onRepsChange={value => onUpdateSet?.(exercise.id, set.id, { reps: value })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button
          variant="neutral"
          size="md"
          fullWidth
          onClick={onAddExercise}
          className={styles.actionButton}
        >
          {t('train.addExercise')}
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onFinish}
          className={styles.actionButton}
        >
          {t('train.finishWorkout')}
        </Button>
        <Button
          variant="neutral"
          size="md"
          fullWidth
          onClick={onCancel}
          className={styles.actionButton}
        >
          {t('train.discard')}
        </Button>
      </div>
    </div>
  );
}
