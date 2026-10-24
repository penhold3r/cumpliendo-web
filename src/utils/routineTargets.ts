import {
  type Exercise,
  type ExerciseTarget,
  type ExerciseTargetOptions,
  type RoutineExerciseTemplate,
} from '../types';

type Linkable = Pick<ExerciseTargetOptions, 'supersetId'>;

/**
 * Keeps superset ids only where they still group neighbours: after removing or reordering
 * exercises, an id left on a single exercise (or split apart) no longer means anything.
 */
export function normalizeSupersets<T extends Linkable>(list: T[]): T[] {
  return list.map((item, i) => {
    if (!item.supersetId) return item;
    const linked =
      list[i - 1]?.supersetId === item.supersetId ||
      list[i + 1]?.supersetId === item.supersetId;
    if (linked) return item;
    const rest = { ...item };
    delete rest.supersetId;
    return rest;
  });
}

/** Links an exercise with the next one into a superset, or unlinks them if already linked. */
export function toggleSupersetWithNext<T extends Linkable>(
  list: T[],
  index: number,
  newId: () => string,
): T[] {
  const current = list[index];
  const next = list[index + 1];
  if (!current || !next) return list;
  if (current.supersetId && current.supersetId === next.supersetId) {
    // Unlink: everything from `next` on in that group starts a new group
    const splitId = newId();
    let inGroup = true;
    const updated = list.map((item, i) => {
      if (i <= index || !inGroup) return item;
      if (item.supersetId !== current.supersetId) {
        inGroup = false;
        return item;
      }
      return { ...item, supersetId: splitId };
    });
    return normalizeSupersets(updated);
  }
  const id = current.supersetId ?? next.supersetId ?? newId();
  return normalizeSupersets(
    list.map((item, i) =>
      i === index || i === index + 1 ? { ...item, supersetId: id } : item,
    ),
  );
}

/** Whether an exercise is linked with the one after it. */
export const isLinkedWithNext = (list: Linkable[], index: number): boolean =>
  !!list[index]?.supersetId &&
  list[index]?.supersetId === list[index + 1]?.supersetId;

/**
 * Superset label for an exercise ("A1", "A2", "B1"…), or null when it isn't in a superset.
 * Groups are lettered in order of appearance.
 */
export function supersetLabel(list: Linkable[], index: number): string | null {
  const id = list[index]?.supersetId;
  if (!id) return null;
  let letter = -1;
  let position = 0;
  for (let i = 0; i <= index; i++) {
    const itemId = list[i]?.supersetId;
    if (!itemId) continue;
    if (i === 0 || list[i - 1]?.supersetId !== itemId) {
      letter++;
      position = 0;
    }
    position++;
  }
  return `${String.fromCharCode(65 + letter)}${position}`;
}

/** The plan carried from a routine exercise into a live workout. */
export const targetFromTemplate = (
  template: RoutineExerciseTemplate,
): ExerciseTarget => ({
  sets: template.defaultSets,
  reps: template.defaultReps,
  setsMax: template.setsMax,
  repsMax: template.repsMax,
  toFailure: template.toFailure,
  perSide: template.perSide,
  supersetId: template.supersetId,
  cue: template.cue,
});

/** Rough time per working set, used only for the routine's duration estimate. */
const SET_SECONDS = 45;

/**
 * Estimated minutes for a routine: each set takes `SET_SECONDS` plus the exercise's rest,
 * except inside a superset, where the rest comes only after the last exercise of each round.
 * Uses the upper bound of set ranges, plus warm-up and cool-down blocks.
 */
export function estimateRoutineMinutes(
  templates: RoutineExerciseTemplate[],
  library: Pick<Exercise, 'id' | 'defaultRestSeconds'>[],
): number {
  const seconds = templates.reduce((total, t, i) => {
    const sets = Math.max(t.defaultSets, t.setsMax ?? 0);
    const rest = library.find(e => e.id === t.exerciseId)?.defaultRestSeconds;
    const restsAfter = isLinkedWithNext(templates, i) ? 0 : rest ?? 60;
    return total + sets * (SET_SECONDS + restsAfter);
  }, 0);
  return Math.max(1, Math.round(seconds / 60));
}
