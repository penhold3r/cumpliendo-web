'use client';

import { Button, Icon, Surface, Text } from '@latty-ds/react';
import { useWorkout } from '@/context/WorkoutContext';
import { useTranslation, routineText, routineCategoryLabel, targetLabel } from '@/i18n';
import { targetFromTemplate } from '@/utils/routineTargets';
import styles from './RoutineCard.module.css';
import type { RoutineCardProps } from './RoutineCard.types';

export function RoutineCard({ routine, onStartRoutine, onEditRoutine, onDeleteRoutine }: RoutineCardProps) {
  const { t } = useTranslation();
  const { state } = useWorkout();
  const { exercises } = state;

  const name = routineText(routine.id, 'name', routine.name);
  const description = routine.description
    ? routineText(routine.id, 'description', routine.description)
    : '';

  const visibleExercises = routine.exercises.slice(0, 4);

  return (
    <Surface appearance="outlined" elevation="1" className={styles.card}>
      <div className={styles.cardBody}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <Text as="h3" variant="h5" className={styles.name}>
              {name}
            </Text>
            {description && (
              <Text variant="body-sm" className={styles.description}>
                {description}
              </Text>
            )}
          </div>

          {(onEditRoutine || onDeleteRoutine) && (
            <div className={styles.actions}>
              {onEditRoutine && (
                <button
                  className={styles.actionButton}
                  onClick={() => onEditRoutine(routine)}
                  aria-label={t('routineCard.edit')}
                >
                  <Icon name="edit" size="sm" />
                </button>
              )}
              {onDeleteRoutine && (
                <button
                  className={styles.actionButton}
                  onClick={() => onDeleteRoutine(routine.id)}
                  aria-label={t('routineCard.delete')}
                >
                  <Icon name="trash" size="sm" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          <span className={styles.tag}>
            {routineCategoryLabel(routine.category)}
          </span>
          <span className={styles.tag}>
            {t('routineCard.estimated', { n: routine.estimatedMinutes })}
          </span>
          <span className={styles.tag}>
            {routine.exercises.length === 1
              ? t('common.exercisesOne')
              : t('common.exercisesN', { n: routine.exercises.length })}
          </span>
        </div>

        {/* Exercises preview */}
        <div className={styles.exercises}>
          {visibleExercises.map((item, idx) => {
            const exData = exercises.find(e => e.id === item.exerciseId);
            const equipment = item.equipment ?? exData?.equipment;
            return (
              <div key={idx} className={styles.exerciseRow}>
                <Text variant="body-sm" className={styles.exerciseName}>
                  • {exData ? exData.name : t('common.exercise')}
                  {equipment ? ` (${equipment})` : ''}
                </Text>
                <Text variant="caption" className={styles.exerciseTarget}>
                  {targetLabel(targetFromTemplate(item))}
                </Text>
              </div>
            );
          })}
          {routine.exercises.length > 4 && (
            <Text variant="caption" className={styles.moreText}>
              {t('routineCard.more', { n: routine.exercises.length - 4 })}
            </Text>
          )}
        </div>

        {/* Start button */}
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => onStartRoutine(routine)}
          className={styles.startButton}
        >
          {t('routineCard.start')}
        </Button>
      </div>
    </Surface>
  );
}
