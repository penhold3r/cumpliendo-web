import { INITIAL_EXERCISES } from '../data/exercises';
import { type Exercise, type Routine } from '../types';

const BUILT_IN_IDS = new Set(INITIAL_EXERCISES.map(ex => ex.id));

/** Created by the user (editable and deletable); built-ins originate in source code. */
export const isCustomExercise = (exercise: Pick<Exercise, 'id'>): boolean =>
  !BUILT_IN_IDS.has(exercise.id);

/** Routines that reference an exercise by id (blocks deletion while in use). */
export const routinesUsingExercise = (
  routines: Routine[],
  exerciseId: string,
): Routine[] =>
  routines.filter(r => r.exercises.some(e => e.exerciseId === exerciseId));
