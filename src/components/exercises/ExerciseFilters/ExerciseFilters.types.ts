import type { ExerciseFilters } from '@/data/exerciseOptions';

export interface ExerciseFiltersProps {
  filters: ExerciseFilters;
  onChange: (filters: ExerciseFilters) => void;
}
