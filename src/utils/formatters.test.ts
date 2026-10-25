import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatDateShort,
  formatDateLong,
  formatDaysAgo,
  formatDuration,
  formatDurationReadable,
  getExerciseIcon,
} from './formatters';

describe('formatters', () => {
  describe('formatDuration', () => {
    it('formats seconds as MM:SS', () => {
      expect(formatDuration(90)).toBe('01:30');
      expect(formatDuration(30)).toBe('00:30');
    });

    it('formats seconds as HH:MM:SS when hours > 0', () => {
      expect(formatDuration(3661)).toBe('1:01:01');
      expect(formatDuration(7200)).toBe('2:00:00');
    });
  });

  describe('formatDurationReadable', () => {
    it('formats as minutes when under 1 hour', () => {
      expect(formatDurationReadable(90)).toBe('1 min');
      expect(formatDurationReadable(3599)).toBe('59 min');
    });

    it('formats as hours and minutes when over 1 hour', () => {
      expect(formatDurationReadable(3661)).toBe('1h 1m');
      expect(formatDurationReadable(7200)).toBe('2h 0m');
    });
  });

  describe('getExerciseIcon', () => {
    it('returns bike for stationary bike', () => {
      expect(getExerciseIcon('cardio', 'Bicicleta fija')).toBe('bike');
    });

    it('returns run for rowing/ski/ergometer', () => {
      expect(getExerciseIcon('cardio', 'Máquina de remo')).toBe('run');
      expect(getExerciseIcon('cardio', 'Máquina de ski')).toBe('run');
      expect(getExerciseIcon('cardio', 'Ergómetro')).toBe('run');
    });

    it('returns jump-rope for jump rope', () => {
      expect(getExerciseIcon('cardio', 'Soga')).toBe('jump-rope');
    });

    it('returns kettlebell for kettlebell', () => {
      expect(getExerciseIcon('legs', 'Kettlebell')).toBe('kettlebell');
    });

    it('returns weight-lifter for barbell', () => {
      expect(getExerciseIcon('chest', 'Barra')).toBe('weight-lifter');
    });

    it('returns dumbbell for dumbbells', () => {
      expect(getExerciseIcon('arms', 'Mancuernas')).toBe('dumbbell');
    });

    it('returns default dumbbell for unknown', () => {
      expect(getExerciseIcon('chest', 'unknown')).toBe('dumbbell');
    });
  });
});
