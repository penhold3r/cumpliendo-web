import { type WorkoutCircuit, type PastWorkoutExerciseItem } from '@/types';
import { isToday, isYesterday } from '@/utils/workoutUtils';
import { itemVolumeKg } from '@/utils/exerciseMeasure';
import { getLocaleTag, i18n } from '@/i18n';
import { amrapMinutes, isAmrap } from '@/utils/circuitTiming';

export { isToday, isYesterday };

export interface LogPastMetrics {
  totalSeconds: number;
  computedMinutes: number;
  workMinutes: number;
  restMinutes: number;
  totalVolume: number;
  totalSets: number;
  totalExercisesCount: number;
}

export const calculateMetrics = (
  circuits: WorkoutCircuit[],
  exerciseItems: PastWorkoutExerciseItem[],
  structureMode: 'circuit' | 'simple',
): LogPastMetrics => {
  let totalWorkSec = 0;
  let totalRestSec = 0;
  let totalVolume = 0;
  let totalSets = 0;
  let totalExercisesCount = 0;

  if (structureMode === 'circuit') {
    circuits.forEach((c, idx) => {
      const rounds = Math.max(1, c.rounds || 1);
      const workSec = c.workSeconds || 30;
      const restSec = c.restSeconds ?? 10;
      const exCount = c.exercises.length;
      const amrap = isAmrap(c);

      if (amrap) {
        totalWorkSec += amrapMinutes(c) * 60;
      } else {
        totalWorkSec += exCount * workSec * rounds;
        totalRestSec += exCount * restSec * rounds;
      }
      totalSets += exCount * rounds;
      totalExercisesCount += exCount;

      if (idx < circuits.length - 1) {
        totalRestSec += c.restBetweenCircuitsSeconds || 60;
      }

      c.exercises.forEach(item => {
        totalVolume += itemVolumeKg(item, rounds);
      });
    });
  } else {
    totalExercisesCount = exerciseItems.length;
    exerciseItems.forEach(item => {
      const rounds = Math.max(1, item.rounds || 1);
      const workSec = item.workSeconds || 30;
      const restSec = item.restSeconds ?? 10;
      totalWorkSec += workSec * rounds;
      totalRestSec += restSec * rounds;
      totalSets += rounds;

      totalVolume += itemVolumeKg(item, rounds);
    });
  }

  const totalSeconds = totalWorkSec + totalRestSec;
  const computedMinutes = Math.max(1, Math.round(totalSeconds / 60));

  return {
    totalSeconds,
    computedMinutes,
    workMinutes: Math.round(totalWorkSec / 60),
    restMinutes: Math.round(totalRestSec / 60),
    totalVolume,
    totalSets,
    totalExercisesCount,
  };
};

export const calendarMonthLabel = (month: number, year: number): string => {
  const name = new Date(year, month, 1).toLocaleDateString(getLocaleTag(), {
    month: 'long',
  });
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
};

export const calendarDayLetters = (): string[] =>
  [0, 1, 2, 3, 4, 5, 6].map(i => i18n.t(`days.letter.${i}`));
