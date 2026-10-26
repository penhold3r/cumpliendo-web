'use client';

import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './AddToRoutineDialog.module.css';

interface AddToRoutineDialogProps {
  open: boolean;
  onClose: () => void;
  exerciseName: string;
  routines: {
    id: string;
    name: string;
  }[];
  onAddToRoutine?: (routineId: string, exerciseId: string) => void;
  onCreateRoutineWithExercise?: () => void;
}

export function AddToRoutineDialog({
  open,
  onClose,
  exerciseName,
  routines,
  onAddToRoutine,
  onCreateRoutineWithExercise,
}: AddToRoutineDialogProps) {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <Text as="h2" variant="lead" className={styles.title}>
            {t('addToRoutine.title')}
          </Text>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t('common.close')}
          >
            {t('common.close')}
          </button>
        </div>

        <Text variant="body-sm" className={styles.exerciseName}>
          {exerciseName}
        </Text>

        <div className={styles.routines}>
          {routines.map(routine => (
            <button
              key={routine.id}
              className={styles.routineItem}
              onClick={() => onAddToRoutine?.(routine.id, exerciseName)}
            >
              {routine.name}
            </button>
          ))}
        </div>

        {onCreateRoutineWithExercise && (
          <button
            className={styles.createButton}
            onClick={onCreateRoutineWithExercise}
          >
            {t('addToRoutine.createWith')}
          </button>
        )}
      </div>
    </div>
  );
}
