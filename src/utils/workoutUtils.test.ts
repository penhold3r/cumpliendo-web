import { describe, expect, it } from 'vitest';
import {
  exerciseMuscles,
  getCompletedThisWeek,
  isBodyweight,
  isToday,
  isYesterday,
  parseReps,
  randomSuffix,
} from './workoutUtils';

describe('workoutUtils', () => {
  describe('parseReps', () => {
    it('returns reps when provided and no detail', () => {
      expect(parseReps(10)).toBe(10);
    });

    it('parses sum combo pattern "3+2"', () => {
      expect(parseReps(undefined, '3+2')).toBe(5);
    });

    it('parses product combo pattern "3x2"', () => {
      expect(parseReps(undefined, '3x2')).toBe(6);
    });

    it('parses product combo pattern "3*4"', () => {
      expect(parseReps(undefined, '3*4')).toBe(12);
    });

    it('falls back to workSeconds-based estimate', () => {
      expect(parseReps(undefined, undefined, 14)).toBe(4);
      expect(parseReps(undefined, undefined, 3.5)).toBe(1);
    });

    it('returns 1 as default', () => {
      expect(parseReps()).toBe(1);
      expect(parseReps(0)).toBe(1);
    });
  });

  describe('isToday', () => {
    it('returns true for today', () => {
      expect(isToday(new Date())).toBe(true);
    });

    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('returns true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday)).toBe(true);
    });

    it('returns false for today', () => {
      expect(isYesterday(new Date())).toBe(false);
    });
  });

  describe('isBodyweight', () => {
    it('returns true for "Sin equipamiento"', () => {
      expect(isBodyweight('Sin equipamiento')).toBe(true);
    });

    it('returns true for legacy "Corporal"', () => {
      expect(isBodyweight('Corporal')).toBe(true);
    });

    it('returns false for barbell', () => {
      expect(isBodyweight('barbell')).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isBodyweight(undefined)).toBe(false);
    });
  });

  describe('exerciseMuscles', () => {
    it('returns muscles array when present', () => {
      const ex = { category: 'chest', muscles: ['chest', 'shoulders'] };
      expect(exerciseMuscles(ex)).toEqual(['chest', 'shoulders']);
    });

    it('falls back to category when no muscles', () => {
      const ex = { category: 'legs' };
      expect(exerciseMuscles(ex)).toEqual(['legs']);
    });
  });

  describe('randomSuffix', () => {
    it('returns a 6-character alphanumeric string', () => {
      const suffix = randomSuffix();
      expect(suffix).toMatch(/^[a-z0-9]{6}$/);
    });
  });

  describe('getCompletedThisWeek', () => {
    it('counts sessions in current week', () => {
      const now = new Date();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      monday.setHours(0, 0, 0, 0);

      const history = [
        { startedAt: monday.toISOString() },
        { startedAt: new Date(monday.getTime() + 86400000).toISOString() }, // Tuesday
        { startedAt: new Date(monday.getTime() - 86400000).toISOString() }, // Sunday (prev week)
      ];

      expect(getCompletedThisWeek(history)).toBe(2);
    });
  });
});
