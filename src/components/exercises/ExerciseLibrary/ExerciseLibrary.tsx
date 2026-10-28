'use client';

import { useState } from 'react';
import { Text } from '@latty-ds/react';
import { useTranslation, exerciseName, musclesLabel, equipmentLabel } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { useWorkout } from '@/context/WorkoutContext';
import { INITIAL_EXERCISES } from '@/data/exercises';
import { matchesExerciseFilter } from '@/utils/exerciseFilter';
import { type ExerciseFilters as Filters, EMPTY_EXERCISE_FILTERS } from '@/data/exerciseOptions';
import { ExerciseFilters } from '../ExerciseFilters';
import styles from './ExerciseLibrary.module.css';

export function ExerciseLibrary() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const { state } = useWorkout();
  const { exercises } = state;

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_EXERCISE_FILTERS);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const filteredExercises = exercises.filter(ex =>
    matchesExerciseFilter(ex, query, filters),
  );

  return (
    <div className={styles.library}>
      <div className={styles.header}>
        <Text as="h1" variant="display-lg" className={styles.title}>
          {t('exercises.title')}
        </Text>
        <Text variant="body-sm" className={styles.subtitle}>
          {t('exercises.subtitle')}
        </Text>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder={t('addExercise.searchPlaceholder')}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <ExerciseFilters filters={filters} onChange={setFilters} />

      <div className={styles.list}>
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className={styles.exerciseCard}>
            <div className={styles.exerciseInfo}>
              <Text as="h3" variant="h5" className={styles.exerciseName}>
                {exerciseName(exercise.id, exercise.name)}
              </Text>
              <Text variant="body-sm" className={styles.exerciseCategory}>
                {musclesLabel([exercise.category])}
              </Text>
            </div>
            <Text variant="caption" className={styles.exerciseEquipment}>
              {equipmentLabel(exercise.equipment)}
            </Text>
          </div>
        ))}
        {filteredExercises.length === 0 && (
          <Text variant="body-sm" className={styles.noResults}>
            {t('exercises.noExercises')}
          </Text>
        )}
      </div>
    </div>
  );
}
