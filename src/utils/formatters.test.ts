import { describe, expect, it } from 'vitest';
import {
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
      expect(getExerciseIcon('stationary_bike', 'legs')).toBe('bike');
    });

    it('returns rowing for rowing machine', () => {
      expect(getExerciseIcon('rowing_machine', 'back')).toBe('rowing');
    });

    it('returns run for treadmill/elliptical', () => {
      expect(getExerciseIcon('treadmill', 'legs')).toBe('run');
      expect(getExerciseIcon('elliptical', 'legs')).toBe('run');
    });

    it('returns jump-rope for jump rope', () => {
      expect(getExerciseIcon('jump_rope', 'legs')).toBe('jump-rope');
    });

    it('returns kettlebell for kettlebell', () => {
      expect(getExerciseIcon('kettlebell', 'legs')).toBe('kettlebell');
    });

    it('returns weight-lifter for barbell', () => {
      expect(getExerciseIcon('barbell', 'chest')).toBe('weight-lifter');
    });

    it('returns dumbbell for dumbbells', () => {
      expect(getExerciseIcon('dumbbells', 'arms')).toBe('dumbbell');
    });

    it('falls back to category icon when equipment is unknown', () => {
      expect(getExerciseIcon('unknown', 'chest')).toBe('arm-flex');
      expect(getExerciseIcon('unknown', 'legs')).toBe('run-fast');
      expect(getExerciseIcon('unknown', 'core')).toBe('human');
    });

    it('returns default dumbbell for unknown equipment and category', () => {
      expect(getExerciseIcon('unknown', 'unknown')).toBe('dumbbell');
    });
  });
});
