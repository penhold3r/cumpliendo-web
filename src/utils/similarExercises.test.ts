import { describe, expect, it } from 'vitest';
import { findSimilarExercises } from './similarExercises';
import { type Exercise } from '../types';

const buildExercise = (id: string, name: string): Exercise =>
  ({
    id,
    name,
    category: 'chest',
    muscles: ['chest'],
    equipment: 'barbell',
    defaultRestSeconds: 60,
  }) as Exercise;

const exercises = [
  buildExercise('ex-1', 'Sentadilla (Squat)'),
  buildExercise('ex-2', 'Press de Banca (Flat Bench Press)'),
  buildExercise('ex-3', 'Peso Muerto (Deadlift)'),
  buildExercise('ex-4', 'Curl de Bíceps (Biceps Curl)'),
  buildExercise('ex-5', 'Remo Inclinado (Bent-over Row)'),
];

describe('similarExercises', () => {
  describe('findSimilarExercises', () => {
    it('returns empty for short input', () => {
      expect(findSimilarExercises('ab', exercises)).toEqual([]);
      expect(findSimilarExercises('', exercises)).toEqual([]);
    });

    it('finds exact match', () => {
      const result = findSimilarExercises('Sentadilla (Squat)', exercises);
      expect(result.map(e => e.id)).toEqual(['ex-1']);
    });

    it('finds match by first language segment', () => {
      const result = findSimilarExercises('Sentadilla', exercises);
      expect(result.map(e => e.id)).toContain('ex-1');
    });

    it('finds match by second language segment', () => {
      const result = findSimilarExercises('Squat', exercises);
      expect(result.map(e => e.id)).toContain('ex-1');
    });

    it('finds partial matches', () => {
      const result = findSimilarExercises('Banca', exercises);
      expect(result.map(e => e.id)).toContain('ex-2');
    });

    it('ignores accents and case', () => {
      const result = findSimilarExercises('peso muerto', exercises);
      expect(result.map(e => e.id)).toContain('ex-3');
    });

    it('limits to MAX_RESULTS (3)', () => {
      const manyExercises = [
        ...exercises,
        buildExercise('ex-6', 'Press de Banca con Mancuernas'),
        buildExercise('ex-7', 'Press de Banca con Barra'),
        buildExercise('ex-8', 'Press de Banca Inclinado'),
      ];
      const result = findSimilarExercises('Press de Banca', manyExercises);
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('puts exact matches first', () => {
      const result = findSimilarExercises('Press de Banca (Flat Bench Press)', exercises);
      expect(result[0].id).toBe('ex-2');
    });
  });
});
