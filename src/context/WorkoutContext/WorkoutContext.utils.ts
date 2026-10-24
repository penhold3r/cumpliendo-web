import {
  type Exercise,
  type LogPastWorkoutInput,
  type Routine,
  type UserStats,
  type WorkoutSession,
  type ExerciseInWorkout,
  type WorkoutSet,
  type PastWorkoutExerciseItem,
} from '../../types';
import { parseReps } from '../../utils/workoutUtils';
import { blockMinutesTotal, toBlockMinutes } from '../../utils/sessionBlocks';
import { weeklyStreak } from '../../utils/streaks';
import { targetFromTemplate } from '../../utils/routineTargets';
import {
  amrapMinutes,
  circuitsSummary,
  isAmrap,
} from '../../utils/circuitTiming';
import {
  itemBaseAmount,
  itemMeasure,
  itemVolumeKg,
  roundAmounts,
  roundSetAmount,
  setVolumeKg,
} from '../../utils/exerciseMeasure';

export { parseReps };

/**
 * One set per round. Round amount follows the ladder (`repsIncrement`) and is saved
 * as reps, meters, or calories depending on unit; written detail ("3+2") applies to a
 * fixed quantity, so with ladders it stays on the first set (from where it is recovered when editing).
 */
const buildItemSets = (
  item: PastWorkoutExerciseItem,
  rounds: number,
  extra: (round: number) => Pick<WorkoutSet, 'id'> & Partial<WorkoutSet>,
): WorkoutSet[] => {
  const measure = itemMeasure(item);
  const amounts = roundAmounts(
    itemBaseAmount(item),
    rounds,
    item.repsIncrement,
  );
  return amounts.map((amount, i) => ({
    setNumber: i + 1,
    weightKg: item.weightKg || 0,
    weightPerSide: item.weightPerSide || undefined,
    ...roundSetAmount(measure, amount),
    repsDetail: item.repsIncrement && i > 0 ? undefined : item.repsDetail,
    completed: true,
    ...extra(i + 1),
  }));
};

/**
 * Builds a WorkoutSession object from a LogPastWorkoutInput.
 */
export function buildPastWorkoutSession(input: LogPastWorkoutInput): {
  newSession: WorkoutSession;
  workoutDate: string;
} {
  let workoutDate = new Date().toISOString();
  if (input.date) {
    workoutDate = new Date(input.date).toISOString();
  } else if (input.dateOption === 'yesterday') {
    workoutDate = new Date(Date.now() - 86400000).toISOString();
  } else if (input.dateOption === 'custom' && input.customDate) {
    workoutDate = new Date(input.customDate).toISOString();
  }

  // Saved duration includes warmup and cooldown blocks.
  const durationSeconds =
    ((input.durationMinutes || 45) + blockMinutesTotal(input)) * 60;

  let computedVolume = 0;
  let exercisesInWorkout: ExerciseInWorkout[] = [];
  let totalWorkSeconds = 0;
  let totalRestSeconds = 0;
  let totalSetsCount = 0;

  if (input.circuits && input.circuits.length > 0) {
    input.circuits.forEach((circuit, cIdx) => {
      const rounds = Math.max(1, circuit.rounds || 1);
      const workSec = circuit.workSeconds || 30;
      const restSec = circuit.restSeconds ?? 10;
      const restBetween = circuit.restBetweenCircuitsSeconds || 0;
      // AMRAP: block duration is fixed by time cap, without per-station pauses
      const amrap = isAmrap(circuit);

      totalRestSeconds += restBetween;
      if (amrap) totalWorkSeconds += amrapMinutes(circuit) * 60;

      circuit.exercises.forEach((item, exIdx) => {
        const exWorkSec = amrap
          ? item.workSeconds
          : item.workSeconds || workSec;
        computedVolume += itemVolumeKg(item, rounds);

        if (!amrap) {
          totalWorkSeconds += (exWorkSec ?? 0) * rounds;
          totalRestSeconds += restSec * rounds;
        }
        totalSetsCount += rounds;

        const sets = buildItemSets(item, rounds, r => ({
          id: `set-c${cIdx}-ex${exIdx}-r${r}-${Date.now()}`,
          timeString:
            item.timeString || (exWorkSec ? `${exWorkSec}s` : undefined),
          workSeconds: exWorkSec,
          restSeconds: amrap ? undefined : restSec,
        }));

        exercisesInWorkout.push({
          id: `item-c${cIdx}-ex${exIdx}-${Date.now()}`,
          exerciseId: item.exerciseId,
          exerciseName: item.exerciseName,
          category: item.category,
          equipment: item.equipment,
          circuitId: circuit.id,
          circuitName: circuit.name,
          measure: item.measure,
          repsIncrement: item.repsIncrement || undefined,
          sets,
          notes: item.repsDetail ? `Detalle: ${item.repsDetail}` : undefined,
        });
      });
    });
  } else if (input.customExercises && input.customExercises.length > 0) {
    exercisesInWorkout = input.customExercises.map((item, exIndex) => {
      const rounds = Math.max(1, item.rounds || 1);
      const workSec =
        item.workSeconds ||
        (item.timeString?.includes('s')
          ? parseInt(item.timeString, 10)
          : undefined);
      computedVolume += itemVolumeKg(item, rounds);
      totalSetsCount += rounds;

      const sets = buildItemSets(item, rounds, r => ({
        id: `set-past-${Date.now()}-${exIndex}-${r}`,
        timeString: item.timeString,
        workSeconds: workSec,
        restSeconds: item.restSeconds,
      }));

      return {
        id: `item-past-${Date.now()}-${exIndex}`,
        exerciseId: item.exerciseId,
        exerciseName: item.exerciseName,
        category: item.category,
        equipment: item.equipment,
        circuitId: item.circuitId,
        circuitName: item.circuitName,
        measure: item.measure,
        repsIncrement: item.repsIncrement || undefined,
        sets,
        notes: item.repsDetail ? `Detalle: ${item.repsDetail}` : undefined,
      };
    });
  } else if (input.selectedExercises && input.selectedExercises.length > 0) {
    exercisesInWorkout = input.selectedExercises.map((ex, exIndex) => ({
      id: `item-past-${Date.now()}-${exIndex}`,
      exerciseId: ex.id,
      exerciseName: ex.name,
      category: ex.category,
      equipment: ex.equipment,
      sets: [
        {
          id: `set-past-${Date.now()}-${exIndex}-1`,
          setNumber: 1,
          weightKg: 0,
          reps: 0,
          completed: true,
        },
      ],
    }));
    totalSetsCount = exercisesInWorkout.length;
  }

  // Auto-generate name based on workout type, format, and date
  const dateObj = new Date(workoutDate);
  const dateStr = dateObj.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
  const autoTitle = `${input.workoutType}${
    input.wodFormat ? ` (${input.wodFormat})` : ''
  } • ${dateStr}`;
  const sessionName = input.name?.trim() ? input.name.trim() : autoTitle;

  // Derived score or rounds
  const derivedScoreOrRounds =
    input.scoreOrRounds ??
    (input.circuits ? circuitsSummary(input.circuits) : undefined);

  const sessionId = input.editSessionId || `workout-past-${Date.now()}`;
  const newSession: WorkoutSession = {
    id: sessionId,
    routineName: sessionName,
    workoutType: input.workoutType,
    wodFormat: input.wodFormat,
    scoreOrRounds: derivedScoreOrRounds,
    startedAt: workoutDate,
    finishedAt: new Date(
      new Date(workoutDate).getTime() + durationSeconds * 1000,
    ).toISOString(),
    durationSeconds,
    totalVolumeKg: computedVolume,
    totalWorkSeconds: totalWorkSeconds > 0 ? totalWorkSeconds : undefined,
    totalRestSeconds: totalRestSeconds > 0 ? totalRestSeconds : undefined,
    completedSets: totalSetsCount,
    totalSets: totalSetsCount,
    exercises: exercisesInWorkout,
    circuits: input.circuits,
    warmupMinutes: toBlockMinutes(input.warmupMinutes),
    cooldownMinutes: toBlockMinutes(input.cooldownMinutes),
    notes: input.notes,
  };

  return { newSession, workoutDate };
}

/** Sums the volume of every session in a list. */
export function totalVolumeOf(sessions: WorkoutSession[]): number {
  return sessions.reduce((acc, s) => acc + (s.totalVolumeKg || 0), 0);
}

/** Volume and completed-set count over the completed sets of a workout. */
export function computeCompletedTotals(exercises: ExerciseInWorkout[]): {
  totalVol: number;
  compSets: number;
} {
  let totalVol = 0;
  let compSets = 0;
  exercises.forEach(item => {
    item.sets.forEach(s => {
      if (s.completed) {
        compSets++;
        totalVol += setVolumeKg(s);
      }
    });
  });
  return { totalVol, compSets };
}

/** Builds a fresh active workout from an optional routine. */
export function buildStartedWorkout(
  routine: Routine | undefined,
  exercises: Exercise[],
  now: number,
): WorkoutSession {
  let exercisesInWorkout: ExerciseInWorkout[] = [];

  if (routine) {
    exercisesInWorkout = routine.exercises.map((templateItem, exIndex) => {
      const exDetail = exercises.find(e => e.id === templateItem.exerciseId);
      // Ranges start at their lower bound; "to failure" has no rep number to prefill
      const plannedReps = templateItem.toFailure ? 0 : templateItem.defaultReps;
      const sets: WorkoutSet[] = Array.from(
        { length: templateItem.defaultSets },
        (_, i) => ({
          id: `set-${now}-${exIndex}-${i + 1}`,
          setNumber: i + 1,
          weightKg: templateItem.defaultWeightKg,
          reps: plannedReps,
          completed: false,
          previousWeightKg: templateItem.defaultWeightKg,
          previousReps: plannedReps,
        }),
      );

      return {
        id: `item-${now}-${exIndex}`,
        exerciseId: templateItem.exerciseId,
        exerciseName: exDetail ? exDetail.name : 'Ejercicio',
        category:
          templateItem.category ?? (exDetail ? exDetail.category : 'chest'),
        equipment:
          templateItem.equipment ?? (exDetail ? exDetail.equipment : 'barbell'),
        sets,
        target: targetFromTemplate(templateItem),
      };
    });
  }

  return {
    id: `workout-${now}`,
    routineId: routine?.id,
    routineName: routine ? routine.name : 'Entrenamiento Libre',
    startedAt: new Date(now).toISOString(),
    durationSeconds: 0,
    totalVolumeKg: 0,
    completedSets: 0,
    totalSets: exercisesInWorkout.reduce(
      (acc, curr) => acc + curr.sets.length,
      0,
    ),
    exercises: exercisesInWorkout,
    warmupMinutes: toBlockMinutes(routine?.warmupMinutes),
    cooldownMinutes: toBlockMinutes(routine?.cooldownMinutes),
  };
}

/** Closes an active workout into a finished session. */
export function buildFinishedSession(
  activeWorkout: WorkoutSession,
  workoutDuration: number,
  nowIso: string,
): WorkoutSession {
  // Only checked sets are part of the record; exercises with none are dropped, so History never
  // shows planned values that weren't done (the finish dialog says so before saving)
  const exercises = activeWorkout.exercises
    .map(item => ({ ...item, sets: item.sets.filter(set => set.completed) }))
    .filter(item => item.sets.length > 0);
  const { totalVol, compSets } = computeCompletedTotals(exercises);
  return {
    ...activeWorkout,
    exercises,
    finishedAt: nowIso,
    durationSeconds: workoutDuration,
    totalVolumeKg: totalVol,
    completedSets: compSets,
    totalSets: compSets,
  };
}

/**
 * Stats derived purely from history (never accumulated or subtracted counters):
 * streak of goal-meeting weeks, days trained this week, total sessions, volume,
 * and last date. Only the goal (`weeklyGoalDays`, `targetWeekdays`) is stored as set.
 */
export function deriveStats(
  stats: UserStats,
  history: WorkoutSession[],
  now: Date = new Date(),
): UserStats {
  const streak = weeklyStreak(history, stats.weeklyGoalDays, now);
  const lastWorkoutDate = history.reduce<string | null>(
    (latest, s) => (!latest || s.startedAt > latest ? s.startedAt : latest),
    null,
  );
  return {
    ...stats,
    currentStreak: streak.current,
    bestStreak: streak.best,
    completedThisWeek: streak.daysThisWeek,
    totalWorkouts: history.length,
    totalVolumeKg: totalVolumeOf(history),
    lastWorkoutDate,
  };
}

export function statsAfterFinish(
  stats: UserStats,
  updatedHistory: WorkoutSession[],
): UserStats {
  return deriveStats(stats, updatedHistory);
}

/** Sorts history newest first by workout date (not upload date). */
export function sortHistory(history: WorkoutSession[]): WorkoutSession[] {
  return [...history].sort((a, b) =>
    a.startedAt < b.startedAt ? 1 : a.startedAt > b.startedAt ? -1 : 0,
  );
}

/** Returns the updated history after logging (or editing) a past session. */
export function historyAfterLogPast(
  history: WorkoutSession[],
  session: WorkoutSession,
  isEditing: boolean,
): WorkoutSession[] {
  return sortHistory(
    isEditing
      ? history.map(s => (s.id === session.id ? session : s))
      : [session, ...history],
  );
}

export function statsAfterLogPast(
  stats: UserStats,
  updatedHistory: WorkoutSession[],
): UserStats {
  return deriveStats(stats, updatedHistory);
}

export function statsAfterSessionUpdate(
  stats: UserStats,
  updatedHistory: WorkoutSession[],
): UserStats {
  return deriveStats(stats, updatedHistory);
}

export function statsAfterSessionDelete(
  stats: UserStats,
  updatedHistory: WorkoutSession[],
): UserStats {
  return deriveStats(stats, updatedHistory);
}

export function statsAfterGoal(
  stats: UserStats,
  history: WorkoutSession[],
  days: number,
  targetDays?: number[],
): UserStats {
  return deriveStats(
    {
      ...stats,
      weeklyGoalDays: Math.max(0, Math.min(7, Math.round(days))),
      targetWeekdays:
        targetDays !== undefined ? targetDays : stats.targetWeekdays,
    },
    history,
  );
}

/** Normalizes stats read from local storage (legacy defaults, volume backfill). */
export function normalizeStoredStats(
  parsed: UserStats,
  history: WorkoutSession[],
): UserStats {
  const next: UserStats = { ...parsed };
  if (
    next.totalWorkouts === 0 &&
    next.weeklyGoalDays === 4 &&
    (!next.targetWeekdays || next.targetWeekdays.length === 3)
  ) {
    next.weeklyGoalDays = 0;
    next.targetWeekdays = [];
  }
  return deriveStats(next, history);
}

/**
 * Whether completing a set of `exerciseIndex` should start the rest timer. Inside a superset the
 * rest comes after the last exercise of the round, so while a later exercise of the same group
 * still has an open set, the athlete moves straight on.
 */
export function shouldRestAfterSet(
  exercises: ExerciseInWorkout[],
  exerciseIndex: number,
): boolean {
  const groupId = exercises[exerciseIndex]?.target?.supersetId;
  if (!groupId) return true;
  for (let i = exerciseIndex + 1; i < exercises.length; i++) {
    const next = exercises[i];
    if (next?.target?.supersetId !== groupId) break;
    if (next.sets.some(s => !s.completed)) return false;
  }
  return true;
}

/**
 * The completed sets from the most recent session that included this exercise, to show as
 * "Previous" in a live workout. `history` is kept newest first.
 */
export function lastPerformance(
  history: WorkoutSession[],
  exerciseId: string,
): WorkoutSet[] {
  for (const session of history) {
    const done = session.exercises
      .filter(e => e.exerciseId === exerciseId)
      .flatMap(e => e.sets.filter(s => s.completed));
    if (done.length > 0) return done;
  }
  return [];
}

/** Whole seconds since an ISO start time (never negative). */
export const elapsedSeconds = (startedAt: string, now: number): number =>
  Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));

/** Whole seconds left until an epoch-ms deadline, rounded up so 0 means it has passed. */
export const secondsUntil = (endsAt: number, now: number): number =>
  Math.max(0, Math.ceil((endsAt - now) / 1000));
