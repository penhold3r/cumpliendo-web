'use client';

import { Button, Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import { type ExerciseFilters, hasActiveFilters } from '@/data/exerciseOptions';
import styles from './ExerciseFilters.module.css';

interface ExerciseFiltersProps {
  filters: ExerciseFilters;
  onChange: (filters: ExerciseFilters) => void;
}

export function ExerciseFilters({ filters, onChange }: ExerciseFiltersProps) {
  const { t } = useTranslation();

  const toggleType = (type: string) => {
    const newTypes = filters.types.includes(type as any)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: newTypes });
  };

  const toggleMuscle = (muscle: string) => {
    const newMuscles = filters.muscles.includes(muscle as any)
      ? filters.muscles.filter(m => m !== muscle)
      : [...filters.muscles, muscle];
    onChange({ ...filters, muscles: newMuscles });
  };

  const toggleEquipment = (equipment: string) => {
    const newEquipment = filters.equipment.includes(equipment as any)
      ? filters.equipment.filter(e => e !== equipment)
      : [...filters.equipment, equipment];
    onChange({ ...filters, equipment: newEquipment });
  };

  const clearAll = () => {
    onChange({ types: [], muscles: [], equipment: [] });
  };

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <Text variant="caption" className={styles.filterLabel}>
          {t('filters.type')}
        </Text>
        <div className={styles.chips}>
          {['strength', 'functional', 'crossfit', 'hiit', 'cardio'].map(type => (
            <button
              key={type}
              className={`${styles.chip} ${filters.types.includes(type as any) ? styles.chipActive : ''}`}
              onClick={() => toggleType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <Text variant="caption" className={styles.filterLabel}>
          {t('filters.muscle')}
        </Text>
        <div className={styles.chips}>
          {['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'glutes'].map(muscle => (
            <button
              key={muscle}
              className={`${styles.chip} ${filters.muscles.includes(muscle as any) ? styles.chipActive : ''}`}
              onClick={() => toggleMuscle(muscle)}
            >
              {muscle}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <Text variant="caption" className={styles.filterLabel}>
          {t('filters.equipment')}
        </Text>
        <div className={styles.chips}>
          {['barbell', 'dumbbells', 'kettlebell', 'cable', 'machine'].map(equip => (
            <button
              key={equip}
              className={`${styles.chip} ${filters.equipment.includes(equip as any) ? styles.chipActive : ''}`}
              onClick={() => toggleEquipment(equip)}
            >
              {equip}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters(filters) && (
        <button className={styles.clearButton} onClick={clearAll}>
          {t('filters.clear')}
        </button>
      )}
    </div>
  );
}
