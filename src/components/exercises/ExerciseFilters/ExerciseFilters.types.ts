import type { ExerciseFilters, hasActiveFilters } from '@/data/exerciseOptions';
import styles from './ExerciseFilters.module.css';

export interface ExerciseFiltersProps {
  filters: ExerciseFilters;
  onChange: (filters: ExerciseFilters) => void;
}
