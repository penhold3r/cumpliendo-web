import { describe, expect, it } from 'vitest';
import {
  estimateRoutineMinutes,
  isLinkedWithNext,
  normalizeSupersets,
  supersetLabel,
  targetFromTemplate,
  toggleSupersetWithNext,
} from './routineTargets';
import { type Exercise, type RoutineExerciseTemplate } from '../types';

const buildTemplate = (overrides: Partial<RoutineExerciseTemplate> = {}): RoutineExerciseTemplate =>
  ({
    exerciseId: 'ex-1',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeightKg: 0,
    ...overrides,
  });

const buildLibraryExercise = (id: string, restSeconds: number): Exercise =>
  ({
    id,
    name: 'Test',
    category: 'chest',
    muscles: ['chest'],
    equipment: 'barbell',
    defaultRestSeconds: restSeconds,
  }) as Exercise;

describe('routineTargets', () => {
  describe('normalizeSupersets', () => {
    it('removes supersetId from isolated exercises', () => {
      const list = [
        { id: 'a', supersetId: 's1' },
        { id: 'b' },
        { id: 'c', supersetId: 's1' },
      ];
      const result = normalizeSupersets(list);
      // 'a' and 'c' are isolated (neighbor 'b' has no supersetId)
      expect(result[0].supersetId).toBeUndefined();
      expect(result[1].supersetId).toBeUndefined();
      expect(result[2].supersetId).toBeUndefined();
    });

    it('keeps supersetId when linked to neighbor', () => {
      const list = [
        { id: 'a', supersetId: 's1' },
        { id: 'b', supersetId: 's1' },
      ];
      const result = normalizeSupersets(list);
      expect(result[0].supersetId).toBe('s1');
      expect(result[1].supersetId).toBe('s1');
    });
  });

  describe('toggleSupersetWithNext', () => {
    it('links two unlinked exercises', () => {
      const list = [
        { id: 'a', supersetId: undefined as string | undefined },
        { id: 'b', supersetId: undefined as string | undefined },
      ];
      const result = toggleSupersetWithNext(list, 0, () => 'new-id');
      expect(result[0].supersetId).toBe('new-id');
      expect(result[1].supersetId).toBe('new-id');
    });

    it('unlinks two linked exercises', () => {
      const list = [{ id: 'a', supersetId: 's1' }, { id: 'b', supersetId: 's1' }, { id: 'c', supersetId: 's1' }];
      const result = toggleSupersetWithNext(list, 0, () => 'new-id');
      // 'a' becomes isolated after split, so loses supersetId; 'b' and 'c' share new-id
      expect(result[0].supersetId).toBeUndefined();
      expect(result[1].supersetId).toBe('new-id');
      expect(result[2].supersetId).toBe('new-id');
    });

    it('returns list unchanged when no next exercise', () => {
      const list = [{ id: 'a', supersetId: undefined }];
      const result = toggleSupersetWithNext(list, 0, () => 'new-id');
      expect(result).toEqual(list);
    });
  });

  describe('isLinkedWithNext', () => {
    it('returns true when linked', () => {
      const list = [
        { id: 'a', supersetId: 's1' as string | undefined },
        { id: 'b', supersetId: 's1' as string | undefined },
      ];
      expect(isLinkedWithNext(list, 0)).toBe(true);
    });

    it('returns false when not linked', () => {
      const list = [
        { id: 'a', supersetId: undefined as string | undefined },
        { id: 'b', supersetId: undefined as string | undefined },
      ];
      expect(isLinkedWithNext(list, 0)).toBe(false);
    });
  });

  describe('supersetLabel', () => {
    it('returns null when no supersetId', () => {
      const list = [
        { id: 'a', supersetId: undefined as string | undefined },
        { id: 'b', supersetId: undefined as string | undefined },
      ];
      expect(supersetLabel(list, 0)).toBeNull();
    });

    it('returns letter+position labels', () => {
      const list = [
        { id: 'a', supersetId: 's1' },
        { id: 'b', supersetId: 's1' },
        { id: 'c', supersetId: 's2' },
        { id: 'd', supersetId: 's2' },
      ];
      expect(supersetLabel(list, 0)).toBe('A1');
      expect(supersetLabel(list, 1)).toBe('A2');
      expect(supersetLabel(list, 2)).toBe('B1');
      expect(supersetLabel(list, 3)).toBe('B2');
    });
  });

  describe('targetFromTemplate', () => {
    it('maps template fields to target', () => {
      const template = buildTemplate({ toFailure: true, perSide: true, supersetId: 's1', cue: 'Go heavy' });
      const target = targetFromTemplate(template);
      expect(target.sets).toBe(3);
      expect(target.reps).toBe(10);
      expect(target.toFailure).toBe(true);
      expect(target.perSide).toBe(true);
      expect(target.supersetId).toBe('s1');
      expect(target.cue).toBe('Go heavy');
    });
  });

  describe('estimateRoutineMinutes', () => {
    it('estimates minutes from sets and rest', () => {
      const templates = [buildTemplate({ defaultSets: 3, defaultReps: 10, defaultWeightKg: 0 })];
      const library = [buildLibraryExercise('ex-1', 90)];
      // 3 sets × (45s + 90s rest) = 405s = 6.75min → 7 min
      expect(estimateRoutineMinutes(templates, library)).toBe(7);
    });

    it('uses upper bound of sets range', () => {
      const templates = [buildTemplate({ defaultSets: 2, setsMax: 4, defaultReps: 10, defaultWeightKg: 0 })];
      const library = [buildLibraryExercise('ex-1', 60)];
      // 4 sets × (45s + 60s rest) = 420s = 7 min
      expect(estimateRoutineMinutes(templates, library)).toBe(7);
    });

    it('omits rest inside superset except after last', () => {
      const templates = [
        buildTemplate({ defaultSets: 2, defaultReps: 10, defaultWeightKg: 0, supersetId: 's1' }),
        buildTemplate({ defaultSets: 2, defaultReps: 10, defaultWeightKg: 0, supersetId: 's1' }),
      ];
      const library = [buildLibraryExercise('ex-1', 90)];
      // Template 0 (linked): 2×45 + 0 rest = 90s
      // Template 1 (last in superset): 2×(45+90) = 270s
      // Total = 360s = 6 min
      expect(estimateRoutineMinutes(templates, library)).toBe(6);
    });

    it('returns at least 1 minute', () => {
      expect(estimateRoutineMinutes([], [])).toBe(1);
    });
  });
});
