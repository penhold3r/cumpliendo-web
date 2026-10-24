import { type MuscleGroup } from '../types';

/**
 * Shared workout utility functions.
 * Centralises logic that was previously duplicated across WorkoutContext and LogPastWorkoutScreen.
 */

/**
 * Parses a rep count from free-form input.
 * Supports plain numbers and combo patterns like "3+2", "3x2", "3*4".
 */
export const parseReps = (
  reps?: number,
  repsDetail?: string,
  workSeconds?: number,
): number => {
  if (repsDetail && repsDetail.trim()) {
    const detail = repsDetail.trim().toLowerCase();
    // Check for combo patterns like "3+2", "3 + 2", "3x2", "3 remos + 2 curls"
    const sumMatches = detail.match(/\d+/g);
    if (sumMatches && sumMatches.length > 0) {
      if (detail.includes('+')) {
        return sumMatches.map(Number).reduce((a, b) => a + b, 0);
      }
      if (detail.includes('x') || detail.includes('*')) {
        return sumMatches.map(Number).reduce((a, b) => a * b, 1);
      }
      const singleNum = parseInt(sumMatches[0], 10);
      if (!isNaN(singleNum)) {
        return singleNum;
      }
    }
  }
  if (typeof reps === 'number' && !isNaN(reps) && reps > 0) {
    return reps;
  }
  if (workSeconds && workSeconds > 0) {
    // ~3.5 seconds per repetition is the standard average cadence
    return Math.max(1, Math.round(workSeconds / 3.5));
  }
  return 1; // default to at least 1 execution so weight isn't multiplied by 0
};

/**
 * Returns true if the given Date falls on today.
 */
export const isToday = (d: Date): boolean => {
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Returns true if the given Date falls on yesterday.
 * Uses setDate(-1) instead of subtracting 86400000ms — DST-safe.
 */
export const isYesterday = (d: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Returns a short random alphanumeric suffix to avoid ID collisions
 * when Date.now() is called multiple times within the same tick.
 */
export const randomSuffix = (): string =>
  Math.random().toString(36).slice(2, 8);

/**
 * Counts workout sessions that fall within the current calendar week (Mon–Sun).
 * Derived directly from history — never accumulated — so it's always accurate.
 */
export const getCompletedThisWeek = (
  history: Array<{ startedAt: string }>,
): number => {
  const now = new Date();
  const currentDayOfWeekIdx = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDayOfWeekIdx);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return history.filter(session => {
    const d = new Date(session.startedAt);
    return d >= startOfWeek && d < endOfWeek;
  }).length;
};

/** Exercise without external weight ('Corporal' is legacy value, still present in saved data). */
export const isBodyweight = (equipment?: string): boolean =>
  equipment === 'Sin equipamiento' || equipment === 'Corporal';

/** Muscle groups of an exercise (exercises saved before multi-select only have `category`). */
export const exerciseMuscles = (exercise: {
  category: MuscleGroup;
  muscles?: MuscleGroup[];
}): MuscleGroup[] =>
  exercise.muscles && exercise.muscles.length > 0
    ? exercise.muscles
    : [exercise.category];
