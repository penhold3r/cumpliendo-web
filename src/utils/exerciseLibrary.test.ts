import { describe, expect, it } from 'vitest';
import { INITIAL_EXERCISES } from '../data/exercises';
import { isCustomExercise, routinesUsingExercise } from './exerciseLibrary';
import { type Exercise, type Routine } from '../types';

const buildExercise = (id: string): Exercise =>
  ({
    id,
    name: 'Test',
    category: 'chest',
    muscles: ['chest'],
    equipment: 'barbell',
    defaultRestSeconds: 60,
  }) as Exercise;

const buildRoutine = (id: string, exerciseIds: string[]): Routine =>
  ({
    id,
    name: 'Test Routine',
    description: '',
    category: 'strength',
    estimatedMinutes: 30,
    exercises: exerciseIds.map(eid => ({ exerciseId: eid, defaultSets: 3, defaultReps: 10, defaultWeightKg: 0 })),
    createdAt: '2024-01-01T00:00:00.000Z',
  }) as Routine;

describe('exerciseLibrary', () => {
  describe('isCustomExercise', () => {
    it('returns false for built-in exercises', () => {
      const builtIn = INITIAL_EXERCISES[0];
      expect(isCustomExercise(builtIn)).toBe(false);
    });

    it('returns true for custom exercises', () => {
      expect(isCustomExercise(buildExercise('ex-custom-1'))).toBe(true);
    });
  });

  describe('routinesUsingExercise', () => {
    it('returns routines that reference the exercise', () => {
      const routines = [
        buildRoutine('r-1', ['ex-1', 'ex-2']),
        buildRoutine('r-2', ['ex-3']),
        buildRoutine('r-3', ['ex-1']),
      ];
      const result = routinesUsingExercise(routines, 'ex-1');
      expect(result.map(r => r.id)).toEqual(['r-1', 'r-3']);
    });

    it('returns empty array when no routines reference the exercise', () => {
      const routines = [buildRoutine('r-1', ['ex-1'])];
      expect(routinesUsingExercise(routines, 'ex-99')).toEqual([]);
    });

    it('returns empty array for empty routines', () => {
      expect(routinesUsingExercise([], 'ex-1')).toEqual([]);
    });
  });
});
