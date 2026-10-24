import { type WorkoutSession } from '../types';

const mondayOf = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const previousMonday = (monday: Date): Date => {
  const d = new Date(monday);
  d.setDate(d.getDate() - 7);
  return d;
};

export const trainingDaysByWeek = (
  history: WorkoutSession[],
): Map<string, Set<string>> => {
  const weeks = new Map<string, Set<string>>();
  history.forEach(session => {
    const date = new Date(session.startedAt);
    if (isNaN(date.getTime())) return;
    const week = dayKey(mondayOf(date));
    const days = weeks.get(week) ?? new Set<string>();
    days.add(dayKey(date));
    weeks.set(week, days);
  });
  return weeks;
};

export interface WeeklyStreak {
  current: number;
  best: number;
  daysThisWeek: number;
}

export const weeklyStreak = (
  history: WorkoutSession[],
  goalDays: number,
  now: Date,
): WeeklyStreak => {
  const weeks = trainingDaysByWeek(history);
  const thisMonday = mondayOf(now);
  const daysThisWeek = weeks.get(dayKey(thisMonday))?.size ?? 0;
  if (goalDays <= 0) return { current: 0, best: 0, daysThisWeek };

  const met = (monday: Date) =>
    (weeks.get(dayKey(monday))?.size ?? 0) >= goalDays;

  let current = 0;
  let cursor = met(thisMonday) ? thisMonday : previousMonday(thisMonday);
  while (met(cursor)) {
    current++;
    cursor = previousMonday(cursor);
  }

  let best = 0;
  let run = 0;
  const firstSession = history.reduce<Date | null>((min, s) => {
    const d = new Date(s.startedAt);
    return isNaN(d.getTime()) || (min && min <= d) ? min : d;
  }, null);
  if (firstSession) {
    const weeksBack: Date[] = [];
    for (
      let m = thisMonday;
      m >= mondayOf(firstSession);
      m = previousMonday(m)
    ) {
      weeksBack.push(m);
    }
    weeksBack.reverse().forEach(monday => {
      run = met(monday) ? run + 1 : 0;
      best = Math.max(best, run);
    });
  }

  return { current, best: Math.max(best, current), daysThisWeek };
};
