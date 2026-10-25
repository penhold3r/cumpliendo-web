import { describe, expect, it } from 'vitest';
import {
  blockMinutesTotal,
  blockLabel,
  blockHint,
  toBlockMinutes,
  formatBlockMinutes,
} from './sessionBlocks';

describe('sessionBlocks', () => {
  describe('blockMinutesTotal', () => {
    it('returns 0 when no blocks', () => {
      expect(blockMinutesTotal({})).toBe(0);
      expect(blockMinutesTotal({ warmupMinutes: 0, cooldownMinutes: 0 })).toBe(0);
    });

    it('sums warmup and cooldown', () => {
      expect(blockMinutesTotal({ warmupMinutes: 5 })).toBe(5);
      expect(blockMinutesTotal({ cooldownMinutes: 10 })).toBe(10);
      expect(blockMinutesTotal({ warmupMinutes: 5, cooldownMinutes: 10 })).toBe(15);
    });
  });

  describe('toBlockMinutes', () => {
    it('returns undefined for 0 or undefined', () => {
      expect(toBlockMinutes(0)).toBeUndefined();
      expect(toBlockMinutes(undefined)).toBeUndefined();
    });

    it('returns the value when positive', () => {
      expect(toBlockMinutes(5)).toBe(5);
      expect(toBlockMinutes(60)).toBe(60);
    });
  });

  describe('blockLabel', () => {
    it('returns translated labels', () => {
      expect(blockLabel('warmup')).toBe('Warm-up');
      expect(blockLabel('cooldown')).toBe('Cool-down');
    });
  });

  describe('blockHint', () => {
    it('returns translated hints', () => {
      expect(blockHint('warmup')).toBe('At the start of the session');
      expect(blockHint('cooldown')).toBe('At the end of the session');
    });
  });

  describe('formatBlockMinutes', () => {
    it('formats positive minutes', () => {
      expect(formatBlockMinutes(5)).toBe('5 min');
      expect(formatBlockMinutes(60)).toBe('60 min');
    });

    it('returns "none" for 0', () => {
      expect(formatBlockMinutes(0)).toBe('None');
    });
  });
});
