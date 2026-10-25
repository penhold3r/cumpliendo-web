import { describe, expect, it } from 'vitest';
import { matchesExerciseFilter } from './exerciseFilter';
import { type Exercise } from '../types';

const buildExercise = (overrides: Partial<Exercise> = {}): Exercise => ({
  id: 'ex-test-1',
  name: 'Sentadilla (Squat)',
  category: 'legs',
  muscles: ['legs', 'glutes'],
  equipment: 'barbell',
  suggestedEquipment: ['dumbbells', 'kettlebell'],
  defaultRestSeconds: 150,
  workoutTypes: ['strength'],
  ...overrides,
});

describe('exerciseFilter', () => {
  describe('matchesExerciseFilter', () => {
    it('matches when no filters and no query', () => {
      const ex = buildExercise();
      expect(matchesExerciseFilter(ex, '', { types: [], muscles: [], equipment: [] })).toBe(true);
    });

    it('filters by search query (name)', () => {
      const ex = buildExercise({ name: 'Press de Banca (Flat Bench Press)' });
      expect(matchesExerciseFilter(ex, 'banca', { types: [], muscles: [], equipment: [] })).toBe(true);
      expect(matchesExerciseFilter(ex, 'squat', { types: [], muscles: [], equipment: [] })).toBe(false);
    });

    it('filters by search query (translated name)', () => {
      const ex = buildExercise({ name: 'Press de Banca Plano (Flat Bench Press)' });
      expect(matchesExerciseFilter(ex, 'flat bench', { types: [], muscles: [], equipment: [] })).toBe(true);
    });

    it('filters by equipment', () => {
      const ex = buildExercise({ equipment: 'barbell' });
      expect(matchesExerciseFilter(ex, '', { types: [], muscles: [], equipment: ['barbell'] })).toBe(true);
      expect(matchesExerciseFilter(ex, '', { types: [], muscles: [], equipment: ['machine'] })).toBe(false);
    });

    it('filters by suggested equipment', () => {
      const ex = buildExercise({ equipment: 'barbell', suggestedEquipment: ['dumbbells'] });
      expect(matchesExerciseFilter(ex, '', { types: [], muscles: [], equipment: ['dumbbells'] })).toBe(true);
    });

    it('filters by muscles (OR within group)', () => {
      const ex = buildExercise({ muscles: ['legs', 'glutes'] });
      expect(matchesExerciseFilter(ex, '', { types: [], muscles: ['legs'], equipment: [] })).toBe(true);
      expect(matchesExerciseFilter(ex, '', { types: [], muscles: ['chest'], equipment: [] })).toBe(false);
    });

    it('filters by types (OR within group)', () => {
      const ex = buildExercise({ workoutTypes: ['strength', 'crossfit'] });
      expect(matchesExerciseFilter(ex, '', { types: ['strength'], muscles: [], equipment: [] })).toBe(true);
      expect(matchesExerciseFilter(ex, '', { types: ['cardio'], muscles: [], equipment: [] })).toBe(false);
    });

    it('combines groups with AND', () => {
      const ex = buildExercise({ equipment: 'barbell', muscles: ['legs'], workoutTypes: ['strength'], suggestedEquipment: [] });
      expect(
        matchesExerciseFilter(ex, '', { types: ['strength'], muscles: ['legs'], equipment: ['barbell'] }),
      ).toBe(true);
      expect(
        matchesExerciseFilter(ex, '', { types: ['strength'], muscles: ['legs'], equipment: ['dumbbells'] }),
      ).toBe(false);
    });
  });
});
