import { describe, expect, it } from 'vitest';
import {
  EXERCISE_MEASURES,
  itemBaseAmount,
  itemMeasure,
  itemVolumeKg,
  loadMultiplier,
  roundAmounts,
  roundSetAmount,
  setVolumeKg,
} from './exerciseMeasure';
import { type PastWorkoutExerciseItem } from '../types';

const buildItem = (overrides: Partial<PastWorkoutExerciseItem> = {}): PastWorkoutExerciseItem =>
  ({
    exerciseId: 'ex-1',
    exerciseName: 'Test',
    category: 'legs',
    equipment: 'barbell',
    ...overrides,
  }) as PastWorkoutExerciseItem;

describe('exerciseMeasure', () => {
  describe('EXERCISE_MEASURES', () => {
    it('contains reps, meters, calories', () => {
      expect(EXERCISE_MEASURES).toEqual(['reps', 'meters', 'calories']);
    });
  });

  describe('itemMeasure', () => {
    it('defaults to reps', () => {
      expect(itemMeasure(buildItem({}))).toBe('reps');
      expect(itemMeasure(buildItem({ measure: undefined }))).toBe('reps');
    });

    it('returns the specified measure', () => {
      expect(itemMeasure(buildItem({ measure: 'meters' }))).toBe('meters');
      expect(itemMeasure(buildItem({ measure: 'calories' }))).toBe('calories');
    });
  });

  describe('loadMultiplier', () => {
    it('returns 2 when weightPerSide is true', () => {
      expect(loadMultiplier(true)).toBe(2);
    });

    it('returns 1 otherwise', () => {
      expect(loadMultiplier(false)).toBe(1);
      expect(loadMultiplier(undefined)).toBe(1);
    });
  });

  describe('itemBaseAmount', () => {
    it('returns 0 for reps without input', () => {
      expect(itemBaseAmount(buildItem({ measure: 'reps', reps: undefined }))).toBe(0);
    });

    it('returns reps value for reps measure', () => {
      expect(itemBaseAmount(buildItem({ measure: 'reps', reps: 10 }))).toBe(10);
    });

    it('parses combo reps like "3+2"', () => {
      expect(itemBaseAmount(buildItem({ measure: 'reps', reps: undefined, repsDetail: '3+2' }))).toBe(5);
    });

    it('parses meters from repsDetail when not reps measure', () => {
      expect(itemBaseAmount(buildItem({ measure: 'meters', reps: undefined, repsDetail: '100' }))).toBe(100);
    });

    it('returns 0 for unparseable non-reps detail', () => {
      expect(itemBaseAmount(buildItem({ measure: 'meters', reps: undefined, repsDetail: 'abc' }))).toBe(0);
    });
  });

  describe('roundAmounts', () => {
    it('returns base amount repeated for rounds', () => {
      expect(roundAmounts(10, 3)).toEqual([10, 10, 10]);
    });

    it('applies increment per round', () => {
      expect(roundAmounts(10, 3, 5)).toEqual([10, 15, 20]);
    });

    it('never returns negative', () => {
      expect(roundAmounts(2, 3, -5)).toEqual([2, 0, 0]);
    });

    it('defaults to 1 round', () => {
      expect(roundAmounts(10, 0)).toEqual([10]);
      expect(roundAmounts(10, -1)).toEqual([10]);
    });
  });

  describe('itemVolumeKg', () => {
    it('returns 0 when weight is 0', () => {
      expect(itemVolumeKg(buildItem({ weightKg: 0, measure: 'reps' }), 3)).toBe(0);
    });

    it('returns 0 when measure is not reps', () => {
      expect(itemVolumeKg(buildItem({ weightKg: 50, measure: 'meters' }), 3)).toBe(0);
    });

    it('calculates volume with weight × total reps', () => {
      expect(itemVolumeKg(buildItem({ weightKg: 50, measure: 'reps', reps: 10 }), 3)).toBe(1500);
    });

    it('applies weightPerSide multiplier', () => {
      expect(
        itemVolumeKg(buildItem({ weightKg: 50, measure: 'reps', reps: 10, weightPerSide: true }), 3),
      ).toBe(3000);
    });

    it('calculates volume with ladder increment', () => {
      expect(
        itemVolumeKg(buildItem({ weightKg: 50, measure: 'reps', reps: 10, repsIncrement: 5 }), 3),
      ).toBe(50 * (10 + 15 + 20));
    });
  });

  describe('setVolumeKg', () => {
    it('calculates weight × reps', () => {
      expect(setVolumeKg({ id: 's1', setNumber: 1, weightKg: 50, reps: 10, completed: false })).toBe(500);
    });

    it('applies weightPerSide multiplier', () => {
      expect(setVolumeKg({ id: 's1', setNumber: 1, weightKg: 50, reps: 10, completed: false, weightPerSide: true })).toBe(1000);
    });

    it('returns 0 for missing values', () => {
      expect(setVolumeKg({ id: 's1', setNumber: 1, weightKg: 0, reps: 10, completed: false })).toBe(0);
      expect(setVolumeKg({ id: 's1', setNumber: 1, weightKg: 50, reps: 0, completed: false })).toBe(0);
    });
  });

  describe('roundSetAmount', () => {
    it('sets reps for reps measure', () => {
      expect(roundSetAmount('reps', 10)).toEqual({ reps: 10 });
    });

    it('sets distanceMeters for meters measure', () => {
      expect(roundSetAmount('meters', 100)).toEqual({ reps: 0, distanceMeters: 100 });
    });

    it('sets calories for calories measure', () => {
      expect(roundSetAmount('calories', 50)).toEqual({ reps: 0, calories: 50 });
    });
  });
});
