'use client';

import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './HistoryFilters.module.css';
import type { HistoryFiltersProps } from './HistoryFilters.types';

const WORKOUT_TYPES = ['strength', 'functional', 'crossfit', 'hiit', 'cardio'];

export function HistoryFilters({ filters, onChange }: HistoryFiltersProps) {
  const { t } = useTranslation();

  const currentFilters = filters ?? { types: [], dateFrom: '', dateTo: '' };

  const toggleType = (type: string) => {
    const newTypes = currentFilters.types.includes(type)
      ? currentFilters.types.filter(t => t !== type)
      : [...currentFilters.types, type];
    onChange({ ...currentFilters, types: newTypes });
  };

  const clearAll = () => {
    onChange({ types: [], dateFrom: '', dateTo: '' });
  };

  const hasActiveFilters =
    currentFilters.types.length > 0 ||
    currentFilters.dateFrom !== '' ||
    currentFilters.dateTo !== '';

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <Text variant="caption" className={styles.filterLabel}>
          {t('insights.formats')}
        </Text>
        <div className={styles.chips}>
          <button
            className={`${styles.chip} ${currentFilters.types.length === 0 ? styles.chipActive : ''}`}
            onClick={() => onChange({ ...currentFilters, types: [] })}
          >
            {t('insights.allTypes')}
          </button>
          {WORKOUT_TYPES.map(type => (
            <button
              key={type}
              className={`${styles.chip} ${currentFilters.types.includes(type) ? styles.chipActive : ''}`}
              onClick={() => toggleType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button className={styles.clearButton} onClick={clearAll}>
          {t('filters.clear')}
        </button>
      )}
    </div>
  );
}
