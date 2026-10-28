'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Text } from '@latty-ds/react';
import { useTranslation, exerciseName, musclesLabel, equipmentLabel } from '@/i18n';
import { useWorkout } from '@/context/WorkoutContext';
import { matchesExerciseFilter } from '@/utils/exerciseFilter';
import { exerciseMuscles } from '@/utils/workoutUtils';
import { EMPTY_EXERCISE_FILTERS, EQUIPMENT_OPTIONS } from '@/data/exerciseOptions';
import type { Exercise, Equipment, MuscleGroup } from '@/types';
import styles from './AddExerciseDialog.module.css';

interface AddExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise, equipment: Equipment, category: MuscleGroup) => void;
}

export function AddExerciseDialog({ open, onClose, onSelect }: AddExerciseDialogProps) {
  const { t } = useTranslation();
  const { state } = useWorkout();
  const searchRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [chosenEquipment, setChosenEquipment] = useState<Equipment>('');
  const [showAllEquipment, setShowAllEquipment] = useState(false);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open && !prevOpen) {
    setQuery('');
    setSelected(null);
    setChosenEquipment('');
    setShowAllEquipment(false);
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selected) setSelected(null);
        else onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, selected, onClose]);

  const filtered = useMemo(() => {
    if (!open) return [];
    return state.exercises.filter(ex =>
      matchesExerciseFilter(ex, query, EMPTY_EXERCISE_FILTERS),
    );
  }, [open, state.exercises, query]);

  const handleSelectExercise = (exercise: Exercise) => {
    setSelected(exercise);
    setChosenEquipment(exercise.equipment);
    setShowAllEquipment(false);
  };

  const handleConfirm = () => {
    if (!selected) return;
    const category = selected.category;
    onSelect(selected, chosenEquipment || selected.equipment, category);
    onClose();
  };

  if (!open) return null;

  const equipmentOptions = selected
    ? [
        selected.equipment,
        ...(selected.suggestedEquipment ?? []).filter(e => e !== selected.equipment),
      ]
    : [];

  const allEquipment = showAllEquipment
    ? EQUIPMENT_OPTIONS.filter(e => !equipmentOptions.includes(e))
    : [];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-labelledby="add-exercise-title"
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <Text as="h2" variant="h4" id="add-exercise-title" className={styles.title}>
            {selected ? exerciseName(selected.id, selected.name) : t('addExercise.title')}
          </Text>
          <button className={styles.closeButton} onClick={selected ? () => setSelected(null) : onClose}>
            {selected ? t('addExercise.backToSearch') : t('common.close')}
          </button>
        </div>

        {!selected ? (
          <>
            <input
              ref={searchRef}
              type="text"
              className={styles.searchInput}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('addExercise.searchPlaceholder')}
              data-testid="exercise-search"
            />
            <div className={styles.list}>
              {filtered.length === 0 ? (
                <Text variant="body-sm" className={styles.empty}>
                  {t('addExercise.emptyCategory')}
                </Text>
              ) : (
                filtered.map(ex => (
                  <button
                    key={ex.id}
                    className={styles.exerciseRow}
                    onClick={() => handleSelectExercise(ex)}
                    data-testid={`exercise-row-${ex.id}`}
                  >
                    <Text variant="body-sm" className={styles.exerciseName}>
                      {exerciseName(ex.id, ex.name)}
                    </Text>
                    <Text variant="caption" className={styles.exerciseMeta}>
                      {musclesLabel(exerciseMuscles(ex))} · {equipmentLabel(ex.equipment)}
                    </Text>
                  </button>
                ))
              )}
            </div>
          </>
        ) : (
          <div className={styles.equipmentStep}>
            <Text variant="body-sm" className={styles.stepLabel}>
              {t('equipmentPicker.equipment')}
            </Text>
            <div className={styles.chipGroup}>
              {equipmentOptions.map(eq => (
                <button
                  key={eq}
                  className={`${styles.chip} ${chosenEquipment === eq ? styles.chipSelected : ''}`}
                  onClick={() => setChosenEquipment(eq)}
                  data-testid={`equipment-chip-${eq}`}
                >
                  {equipmentLabel(eq)}
                </button>
              ))}
              {allEquipment.map(eq => (
                <button
                  key={eq}
                  className={`${styles.chip} ${chosenEquipment === eq ? styles.chipSelected : ''}`}
                  onClick={() => setChosenEquipment(eq)}
                >
                  {equipmentLabel(eq)}
                </button>
              ))}
            </div>
            {!showAllEquipment && (
              <button
                className={styles.showAllButton}
                onClick={() => setShowAllEquipment(true)}
              >
                {t('equipmentPicker.showAll')}
              </button>
            )}
            <div className={styles.confirmRow}>
              <Button variant="primary" onClick={handleConfirm}>
                {t('equipmentPicker.add')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
