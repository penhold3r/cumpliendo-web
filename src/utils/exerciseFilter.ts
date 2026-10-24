import { type Exercise } from '../types';
import { type ExerciseFilters } from '../data/exerciseOptions';
import { equipmentLabel, exerciseName, muscleLabel } from '../i18n';
import { exerciseMuscles } from './workoutUtils';

/**
 * Library search and filters (Exercise Library screen and Add Exercise bottom sheet).
 * Query text is searched across stored and translated values. Each filter group matches
 * if the exercise contains any selected value (OR); groups are combined together (AND).
 */
export const matchesExerciseFilter = (
  exercise: Exercise,
  query: string,
  filters: ExerciseFilters,
): boolean => {
  const muscles = exerciseMuscles(exercise);
  const q = query.trim().toLowerCase();
  const matchesSearch =
    q === '' ||
    [
      exercise.name,
      exerciseName(exercise.id, exercise.name),
      exercise.equipment,
      equipmentLabel(exercise.equipment),
      ...muscles,
      ...muscles.map(muscleLabel),
    ].some(value => value.toLowerCase().includes(q));

  // Legacy exercises might have a training discipline stored as category
  const types: string[] = [...(exercise.workoutTypes ?? []), exercise.category];
  const matchesTypes =
    filters.types.length === 0 || filters.types.some(t => types.includes(t));
  const matchesMuscles =
    filters.muscles.length === 0 ||
    filters.muscles.some(m => muscles.includes(m));
  // Equipment: primary or any suggested alternative
  const equipment = [
    exercise.equipment,
    ...(exercise.suggestedEquipment ?? []),
  ];
  const matchesEquipment =
    filters.equipment.length === 0 ||
    filters.equipment.some(e => equipment.includes(e));

  return matchesSearch && matchesTypes && matchesMuscles && matchesEquipment;
};
