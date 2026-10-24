import {
  type MuscleGroup,
  type WodFormat,
  type WorkoutSession,
  type WorkoutType,
} from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Length of the window the Home tiles compare (and the one before it). */
export const INSIGHT_WINDOW_DAYS = 30;
/** Weeks shown in the detail sheets' weekly charts. */
export const INSIGHT_WEEKS = 12;
/** How far back the records sheet lists PRs. */
export const RECORDS_WINDOW_DAYS = 90;

const timeOf = (session: WorkoutSession) =>
  new Date(session.startedAt).getTime();

/** A session's training type; live workouts don't pick one, they're gym sessions. */
const sessionType = (session: WorkoutSession): WorkoutType =>
  session.workoutType ?? 'strength';

/** Sessions started in the last `days` days. */
const sessionsWithin = (
  history: WorkoutSession[],
  now: Date,
  days: number,
): WorkoutSession[] => {
  const end = now.getTime();
  const start = end - days * DAY_MS;
  return history.filter(s => timeOf(s) > start && timeOf(s) <= end);
};

export interface WindowTotals {
  sessions: number;
  seconds: number;
}

/**
 * Sessions and training time in the last `days` days and in the `days` before them. Time counts
 * every discipline the same, so WODs and HIIT weigh as much as lifting.
 */
export const windowTotals = (
  history: WorkoutSession[],
  now: Date = new Date(),
  days: number = INSIGHT_WINDOW_DAYS,
): { current: WindowTotals; previous: WindowTotals } => {
  const end = now.getTime();
  const start = end - days * DAY_MS;
  const previousStart = start - days * DAY_MS;
  const current = { sessions: 0, seconds: 0 };
  const previous = { sessions: 0, seconds: 0 };
  history.forEach(session => {
    const time = timeOf(session);
    const bucket =
      time > start && time <= end
        ? current
        : time > previousStart && time <= start
        ? previous
        : null;
    if (!bucket) return;
    bucket.sessions += 1;
    bucket.seconds += Math.max(0, session.durationSeconds);
  });
  return { current, previous };
};

/** Monday 00:00 (local time) of a date's week. */
const mondayOf = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};

export interface WeekActivity {
  /** Monday 00:00 of the week, ISO */
  weekStart: string;
  sessions: number;
  seconds: number;
  /** The same totals split by training type (only types done that week) */
  byType: Partial<Record<WorkoutType, { sessions: number; seconds: number }>>;
}

/** Sessions and time per Monday–Sunday week, oldest first, ending with the current week. */
export const weeklyActivity = (
  history: WorkoutSession[],
  now: Date = new Date(),
  weeks: number = INSIGHT_WEEKS,
): WeekActivity[] => {
  const mondays: Date[] = [];
  const current = mondayOf(now);
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(current);
    // setDate keeps local midnight across DST changes
    d.setDate(d.getDate() - i * 7);
    mondays.push(d);
  }
  const result: WeekActivity[] = mondays.map(d => ({
    weekStart: d.toISOString(),
    sessions: 0,
    seconds: 0,
    byType: {},
  }));
  const index = new Map(mondays.map((d, i) => [d.getTime(), i]));
  history.forEach(session => {
    const date = new Date(session.startedAt);
    if (isNaN(date.getTime()) || date > now) return;
    const i = index.get(mondayOf(date).getTime());
    const week = i === undefined ? undefined : result[i];
    if (!week) return;
    const seconds = Math.max(0, session.durationSeconds);
    week.sessions += 1;
    week.seconds += seconds;
    const type = sessionType(session);
    const byType = week.byType[type] ?? { sessions: 0, seconds: 0 };
    byType.sessions += 1;
    byType.seconds += seconds;
    week.byType[type] = byType;
  });
  return result;
};

/** Fewest weeks a weekly chart shows, so a new user's chart isn't a couple of wide bars. */
export const MIN_CHART_WEEKS = 6;

/**
 * The weeks worth charting: from the first week with a session (at least `minWeeks`, ending with
 * the current week), so months before the user started logging aren't drawn as empty columns.
 */
export const chartWeeks = (
  weeks: WeekActivity[],
  minWeeks: number = MIN_CHART_WEEKS,
): WeekActivity[] => {
  const first = weeks.findIndex(w => w.sessions > 0);
  const start =
    first === -1
      ? weeks.length - minWeeks
      : Math.min(first, weeks.length - minWeeks);
  return weeks.slice(Math.max(0, start));
};

/**
 * Weekly average of `field`, counted from the first week with any session (so a user who
 * started logging two weeks ago isn't averaged over twelve). 0 without sessions.
 */
export const weeklyAverage = (
  weeks: WeekActivity[],
  field: 'sessions' | 'seconds',
): number => {
  const first = weeks.findIndex(w => w.sessions > 0);
  if (first === -1) return 0;
  const active = weeks.slice(first);
  return active.reduce((sum, w) => sum + w[field], 0) / active.length;
};

/** Average session length over the last `days` days (0 without sessions). */
export const averageSessionSeconds = (
  history: WorkoutSession[],
  now: Date = new Date(),
  days: number = INSIGHT_WINDOW_DAYS,
): number => {
  const sessions = sessionsWithin(history, now, days);
  if (sessions.length === 0) return 0;
  const total = sessions.reduce(
    (sum, s) => sum + Math.max(0, s.durationSeconds),
    0,
  );
  return Math.round(total / sessions.length);
};

export interface TypeWeekComparison {
  type: WorkoutType;
  thisWeek: number;
  lastWeek: number;
}

/**
 * Sessions per training type this Monday–Sunday week and the one before, for the types done in
 * either week (most this week first).
 */
export const thisWeekVsLastByType = (
  history: WorkoutSession[],
  now: Date = new Date(),
): TypeWeekComparison[] => {
  const thisMonday = mondayOf(now);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(lastMonday.getDate() - 7);
  const rows = new Map<WorkoutType, TypeWeekComparison>();
  history.forEach(session => {
    const date = new Date(session.startedAt);
    if (isNaN(date.getTime()) || date > now || date < lastMonday) return;
    const type = sessionType(session);
    const row = rows.get(type) ?? { type, thisWeek: 0, lastWeek: 0 };
    if (date >= thisMonday) row.thisWeek += 1;
    else row.lastWeek += 1;
    rows.set(type, row);
  });
  return [...rows.values()].sort(
    (a, b) => b.thisWeek - a.thisWeek || b.lastWeek - a.lastWeek,
  );
};

export interface TypeOverview {
  type: WorkoutType;
  /** Sessions in the last `weeks` weeks */
  sessions: number;
  /** Last session of this type ever, ISO */
  lastAt: string;
}

/**
 * Every training type the user has logged: sessions in the last `weeks` weeks (most first) and
 * when it was last done, so a neglected discipline shows up.
 */
export const typeOverview = (
  history: WorkoutSession[],
  now: Date = new Date(),
  weeks: number = INSIGHT_WEEKS,
): TypeOverview[] => {
  const recent = new Set(sessionsWithin(history, now, weeks * 7));
  const rows = new Map<WorkoutType, { sessions: number; last: number }>();
  history.forEach(session => {
    const time = timeOf(session);
    if (isNaN(time) || time > now.getTime()) return;
    const type = sessionType(session);
    const row = rows.get(type) ?? { sessions: 0, last: 0 };
    if (recent.has(session)) row.sessions += 1;
    row.last = Math.max(row.last, time);
    rows.set(type, row);
  });
  return [...rows]
    .map(([type, row]) => ({
      type,
      sessions: row.sessions,
      lastAt: new Date(row.last).toISOString(),
    }))
    .sort(
      (a, b) => b.sessions - a.sessions || b.lastAt.localeCompare(a.lastAt),
    );
};

export interface TypeProfile {
  sessions: number;
  /** Weekly average from the first week with a session of this type */
  perWeek: number;
  avgSeconds: number;
  totalSeconds: number;
  volumeKg: number;
  /** Completed, non-warmup sets */
  sets: number;
  reps: number;
  meters: number;
  calories: number;
  /** Circuit rounds (completed rounds in AMRAP blocks) */
  rounds: number;
  /** WOD formats, most used first */
  formats: { format: WodFormat; sessions: number }[];
  /** Movements in the most sessions (with a completed set), at most 3 */
  topMovements: {
    exerciseId: string;
    exerciseName: string;
    sessions: number;
  }[];
  /** Heaviest completed set per exercise, heaviest first, at most 3 */
  heaviestSets: {
    exerciseId: string;
    exerciseName: string;
    weightKg: number;
    reps: number;
    weightPerSide: boolean;
  }[];
  /** Per-week sessions and time of this type, as in `weeklyActivity` */
  weeks: WeekActivity[];
}

/** What a training type looked like over the last `weeks` weeks. */
export const typeProfile = (
  history: WorkoutSession[],
  type: WorkoutType,
  now: Date = new Date(),
  weeks: number = INSIGHT_WEEKS,
): TypeProfile => {
  const ofType = history.filter(s => sessionType(s) === type);
  const sessions = sessionsWithin(ofType, now, weeks * 7);
  const weekRows = weeklyActivity(ofType, now, weeks);
  const formats = new Map<WodFormat, number>();
  const movements = new Map<
    string,
    { exerciseId: string; exerciseName: string; sessions: number }
  >();
  const heaviest = new Map<string, TypeProfile['heaviestSets'][number]>();
  const profile = {
    totalSeconds: 0,
    volumeKg: 0,
    sets: 0,
    reps: 0,
    meters: 0,
    calories: 0,
    rounds: 0,
  };
  sessions.forEach(session => {
    profile.totalSeconds += Math.max(0, session.durationSeconds);
    profile.volumeKg += Math.max(0, session.totalVolumeKg);
    if (session.wodFormat) {
      formats.set(session.wodFormat, (formats.get(session.wodFormat) ?? 0) + 1);
    }
    session.circuits?.forEach(circuit => {
      profile.rounds += Math.max(0, circuit.rounds);
    });
    const seen = new Set<string>();
    session.exercises.forEach(exercise => {
      const done = exercise.sets.filter(set => set.completed && !set.isWarmup);
      if (done.length === 0) return;
      done.forEach(set => {
        profile.sets += 1;
        profile.reps += Math.max(0, set.reps);
        profile.meters += set.distanceMeters ?? 0;
        profile.calories += set.calories ?? 0;
        if (set.weightKg > 0 && set.reps > 0) {
          const top = heaviest.get(exercise.exerciseId);
          if (
            !top ||
            set.weightKg > top.weightKg ||
            (set.weightKg === top.weightKg && set.reps > top.reps)
          ) {
            heaviest.set(exercise.exerciseId, {
              exerciseId: exercise.exerciseId,
              exerciseName: exercise.exerciseName,
              weightKg: set.weightKg,
              reps: set.reps,
              weightPerSide: set.weightPerSide === true,
            });
          }
        }
      });
      if (seen.has(exercise.exerciseId)) return;
      seen.add(exercise.exerciseId);
      const row = movements.get(exercise.exerciseId) ?? {
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        sessions: 0,
      };
      row.sessions += 1;
      movements.set(exercise.exerciseId, row);
    });
  });
  return {
    sessions: sessions.length,
    perWeek: weeklyAverage(weekRows, 'sessions'),
    avgSeconds:
      sessions.length > 0
        ? Math.round(profile.totalSeconds / sessions.length)
        : 0,
    ...profile,
    formats: [...formats]
      .map(([format, count]) => ({ format, sessions: count }))
      .sort((a, b) => b.sessions - a.sessions),
    topMovements: [...movements.values()]
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 3),
    heaviestSets: [...heaviest.values()]
      .sort((a, b) => b.weightKg - a.weightKg)
      .slice(0, 3),
    weeks: weekRows,
  };
};

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  /** Best weight before this session */
  previousKg: number;
  /** Load is per hand (two dumbbells/kettlebells). */
  weightPerSide: boolean;
  startedAt: string;
}

/**
 * Every time an exercise was lifted heavier than ever before (completed, non-warmup sets with
 * reps), newest first: one entry per exercise and session, with its heaviest set. An exercise's
 * first session sets the baseline, not a record.
 */
export const personalRecords = (
  history: WorkoutSession[],
): PersonalRecord[] => {
  const best = new Map<string, number>();
  const records: PersonalRecord[] = [];
  const chronological = [...history].sort((a, b) => timeOf(a) - timeOf(b));
  for (const session of chronological) {
    // Bests are compared against earlier sessions only, then updated at the end
    const sessionTops = new Map<string, PersonalRecord>();
    session.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (!set.completed || set.isWarmup) return;
        if (set.weightKg <= 0 || set.reps <= 0) return;
        const top = sessionTops.get(exercise.exerciseId);
        if (
          top &&
          (top.weightKg > set.weightKg ||
            (top.weightKg === set.weightKg && top.reps >= set.reps))
        ) {
          return;
        }
        sessionTops.set(exercise.exerciseId, {
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          weightKg: set.weightKg,
          reps: set.reps,
          previousKg: 0,
          weightPerSide: set.weightPerSide === true,
          startedAt: session.startedAt,
        });
      });
    });
    for (const [id, top] of sessionTops) {
      const previous = best.get(id);
      if (previous !== undefined && top.weightKg > previous) {
        records.push({ ...top, previousKg: previous });
      }
      if (previous === undefined || top.weightKg > previous) {
        best.set(id, top.weightKg);
      }
    }
  }
  return records.reverse();
};

/**
 * The most recent record; when one session beat several bests, the biggest relative jump.
 */
export const latestPersonalRecord = (
  history: WorkoutSession[],
): PersonalRecord | null => {
  const records = personalRecords(history);
  const first = records[0];
  if (!first) return null;
  const jump = (r: PersonalRecord) => r.weightKg / r.previousKg;
  return records
    .filter(r => r.startedAt === first.startedAt)
    .reduce((top, r) => (jump(r) > jump(top) ? r : top), first);
};

/** Records set in the last `days` days, newest first. */
export const recentPersonalRecords = (
  history: WorkoutSession[],
  now: Date = new Date(),
  days: number = RECORDS_WINDOW_DAYS,
): PersonalRecord[] => {
  const start = now.getTime() - days * DAY_MS;
  return personalRecords(history).filter(
    r => new Date(r.startedAt).getTime() > start,
  );
};

/** Body muscle groups; disciplines such as CrossFit or Cardio aren't muscles to rest. */
const BODY_MUSCLES: ReadonlySet<MuscleGroup> = new Set<MuscleGroup>([
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
  'glutes',
  'full_body',
  // Legacy Spanish keys for backward compatibility
  'Pecho',
  'Espalda',
  'Piernas',
  'Hombros',
  'Brazos',
  'Core',
  'Glúteos',
  'Cuerpo Completo',
]);

/**
 * When each muscle group the user trains was last trained (an exercise's primary group, with at
 * least one completed set), longest ago first; groups last trained in the same session are
 * ordered by fewest completed sets overall, the less trained one first.
 */
export const muscleRecency = (
  history: WorkoutSession[],
): { muscle: MuscleGroup; lastTrainedAt: string }[] => {
  const last = new Map<MuscleGroup, number>();
  const sets = new Map<MuscleGroup, number>();
  history.forEach(session => {
    const time = timeOf(session);
    session.exercises.forEach(exercise => {
      if (!BODY_MUSCLES.has(exercise.category)) return;
      const done = exercise.sets.filter(set => set.completed).length;
      if (done === 0) return;
      sets.set(exercise.category, (sets.get(exercise.category) ?? 0) + done);
      const previous = last.get(exercise.category);
      if (previous === undefined || time > previous) {
        last.set(exercise.category, time);
      }
    });
  });
  return [...last]
    .sort(
      (a, b) => a[1] - b[1] || (sets.get(a[0]) ?? 0) - (sets.get(b[0]) ?? 0),
    )
    .map(([muscle, time]) => ({
      muscle,
      lastTrainedAt: new Date(time).toISOString(),
    }));
};

/** The trained muscle group that has rested longest. */
export const leastRecentMuscle = (
  history: WorkoutSession[],
): { muscle: MuscleGroup; lastTrainedAt: string } | null =>
  muscleRecency(history)[0] ?? null;

/** Completed, non-warmup sets per muscle group over the last `days` days, most first. */
export const setsByMuscle = (
  history: WorkoutSession[],
  now: Date = new Date(),
  days: number = INSIGHT_WINDOW_DAYS,
): { muscle: MuscleGroup; sets: number }[] => {
  const totals = new Map<MuscleGroup, number>();
  sessionsWithin(history, now, days).forEach(session => {
    session.exercises.forEach(exercise => {
      if (!BODY_MUSCLES.has(exercise.category)) return;
      const sets = exercise.sets.filter(s => s.completed && !s.isWarmup).length;
      if (sets === 0) return;
      totals.set(
        exercise.category,
        (totals.get(exercise.category) ?? 0) + sets,
      );
    });
  });
  return [...totals]
    .map(([muscle, sets]) => ({ muscle, sets }))
    .sort((a, b) => b.sets - a.sets);
};

/** Whole calendar days between a date and today (0 = today). */
export const calendarDaysAgo = (
  isoString: string,
  now: Date = new Date(),
): number => {
  const date = new Date(isoString);
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.max(0, Math.round((startOf(now) - startOf(date)) / DAY_MS));
};
