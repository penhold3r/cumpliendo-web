import {
  type ExerciseMeasure,
  type PastWorkoutExerciseItem,
  type WorkoutSet,
} from '../types';
import { parseReps } from './workoutUtils';

export const EXERCISE_MEASURES: ExerciseMeasure[] = [
  'reps',
  'meters',
  'calories',
];

export const itemMeasure = (item: {
  measure?: ExerciseMeasure;
}): ExerciseMeasure => item.measure ?? 'reps';

/** Load multiplier: two dumbbells/kettlebells (weight per hand) count double. */
export const loadMultiplier = (weightPerSide?: boolean): number =>
  weightPerSide ? 2 : 1;

/**
 * Quantity for the first round: reps (supports combos like "3+2") or meters/calories.
 * Only explicit inputs count: without reps, there are no reps (and no volume), even if the
 * station has a duration; reps are never estimated from seconds.
 */
export const itemBaseAmount = (item: PastWorkoutExerciseItem): number => {
  if (itemMeasure(item) === 'reps') {
    const hasInput = Boolean(item.repsDetail?.trim()) || (item.reps ?? 0) > 0;
    return hasInput ? parseReps(item.reps, item.repsDetail) : 0;
  }
  if (typeof item.reps === 'number' && !isNaN(item.reps)) return item.reps;
  const parsed = parseFloat((item.repsDetail ?? '').replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
};

/** Quantity per round: base ladder + increment × round index, never negative. */
export const roundAmounts = (
  base: number,
  rounds: number,
  increment = 0,
): number[] =>
  Array.from({ length: Math.max(1, rounds) }, (_, i) =>
    Math.max(0, base + i * increment),
  );

/** Volume (kg) of an exercise across rounds; distance and calories add no volume. */
export const itemVolumeKg = (
  item: PastWorkoutExerciseItem,
  rounds: number,
): number => {
  const weight = item.weightKg || 0;
  if (weight <= 0 || itemMeasure(item) !== 'reps') return 0;
  const total = roundAmounts(
    itemBaseAmount(item),
    rounds,
    item.repsIncrement,
  ).reduce((a, b) => a + b, 0);
  return weight * loadMultiplier(item.weightPerSide) * total;
};

/** Volume (kg) of a recorded set. */
export const setVolumeKg = (set: WorkoutSet): number =>
  (set.weightKg || 0) * loadMultiplier(set.weightPerSide) * (set.reps || 0);

/** Set fields for a round according to its unit measure. */
export const roundSetAmount = (
  measure: ExerciseMeasure,
  amount: number,
): Pick<WorkoutSet, 'reps' | 'distanceMeters' | 'calories'> =>
  measure === 'meters'
    ? { reps: 0, distanceMeters: amount }
    : measure === 'calories'
    ? { reps: 0, calories: amount }
    : { reps: amount };
