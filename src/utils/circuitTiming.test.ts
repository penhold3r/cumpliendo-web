import { describe, expect, it } from 'vitest';
import { amrapMinutes, circuitsSummary, isAmrap } from './circuitTiming';
import { type WorkoutCircuit } from '../types';

const buildCircuit = (overrides: Partial<WorkoutCircuit> = {}): WorkoutCircuit =>
  ({
    id: 'c-1',
    name: 'Test Circuit',
    rounds: 3,
    workSeconds: 30,
    restSeconds: 10,
    exercises: [],
    ...overrides,
  }) as WorkoutCircuit;

describe('circuitTiming', () => {
  describe('isAmrap', () => {
    it('returns true for amrap blockType', () => {
      expect(isAmrap(buildCircuit({ blockType: 'amrap' }))).toBe(true);
    });

    it('returns false for other blockTypes', () => {
      expect(isAmrap(buildCircuit({ blockType: 'intervals' }))).toBe(false);
      expect(isAmrap(buildCircuit({}))).toBe(false);
    });
  });

  describe('amrapMinutes', () => {
    it('returns timeCapMinutes when set', () => {
      expect(amrapMinutes(buildCircuit({ blockType: 'amrap', timeCapMinutes: 12 }))).toBe(12);
    });

    it('defaults to DEFAULT_AMRAP_MINUTES', () => {
      expect(amrapMinutes(buildCircuit({ blockType: 'amrap' }))).toBe(8);
      expect(amrapMinutes(buildCircuit({}))).toBe(8);
    });
  });

  describe('circuitsSummary', () => {
    it('returns undefined for empty circuits', () => {
      expect(circuitsSummary([])).toBeUndefined();
    });

    it('summarizes single AMRAP circuit', () => {
      expect(circuitsSummary([buildCircuit({ blockType: 'amrap', timeCapMinutes: 8 })])).toBe('1 AMRAP × 8 min');
    });

    it('summarizes multiple AMRAP circuits with same cap', () => {
      const circuits = [
        buildCircuit({ id: 'c1', blockType: 'amrap', timeCapMinutes: 8 }),
        buildCircuit({ id: 'c2', blockType: 'amrap', timeCapMinutes: 8 }),
      ];
      expect(circuitsSummary(circuits)).toBe('2 AMRAP × 8 min');
    });

    it('summarizes multiple AMRAP circuits with different caps', () => {
      const circuits = [
        buildCircuit({ id: 'c1', blockType: 'amrap', timeCapMinutes: 8 }),
        buildCircuit({ id: 'c2', blockType: 'amrap', timeCapMinutes: 12 }),
      ];
      expect(circuitsSummary(circuits)).toBe('2 AMRAP • 20 min');
    });

    it('summarizes intervals circuit', () => {
      expect(circuitsSummary([buildCircuit({ blockType: 'intervals', rounds: 2, workSeconds: 40, restSeconds: 20 })])).toBe('1 Circuit • 2 Rounds (40s × 20s)');
    });

    it('summarizes multiple intervals circuits', () => {
      const circuits = [
        buildCircuit({ id: 'c1', blockType: 'intervals', rounds: 3, workSeconds: 30, restSeconds: 10 }),
        buildCircuit({ id: 'c2', blockType: 'intervals', rounds: 2, workSeconds: 45, restSeconds: 15 }),
      ];
      expect(circuitsSummary(circuits)).toBe('2 Circuits • 3 Rounds (30s × 10s)');
    });
  });
});
