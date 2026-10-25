import { describe, expect, it } from 'vitest';
import {
  fromDisplayWeight,
  formatWeight,
  toDisplayWeight,
  weightUnitLabel,
} from './units';

describe('units', () => {
  describe('toDisplayWeight', () => {
    it('converts kg to lb for imperial units', () => {
      expect(toDisplayWeight(10, 'imperial')).toBe(22.0);
      expect(toDisplayWeight(100, 'imperial')).toBe(220.5);
    });

    it('returns kg unchanged for metric units', () => {
      expect(toDisplayWeight(10, 'metric')).toBe(10);
      expect(toDisplayWeight(100, 'metric')).toBe(100);
    });
  });

  describe('fromDisplayWeight', () => {
    it('converts lb to kg for imperial units', () => {
      expect(fromDisplayWeight(22.0462, 'imperial')).toBeCloseTo(10);
      expect(fromDisplayWeight(1, 'imperial')).toBeCloseTo(0.453592);
    });

    it('returns kg unchanged for metric units', () => {
      expect(fromDisplayWeight(10, 'metric')).toBe(10);
      expect(fromDisplayWeight(100, 'metric')).toBe(100);
    });
  });

  describe('weightUnitLabel', () => {
    it('returns "kg" for metric', () => {
      expect(weightUnitLabel('metric')).toBe('kg');
    });

    it('returns "lb" for imperial', () => {
      expect(weightUnitLabel('imperial')).toBe('lb');
    });
  });

  describe('formatWeight', () => {
    it('formats metric weights', () => {
      expect(formatWeight(10, 'metric')).toBe('10 kg');
      expect(formatWeight(100, 'metric')).toBe('100 kg');
      expect(formatWeight(2500, 'metric')).toBe('2.5 t');
    });

    it('formats imperial weights', () => {
      expect(formatWeight(10, 'imperial')).toBe('22 lb');
      expect(formatWeight(453.592, 'imperial')).toBe('1,000 lb');
      expect(formatWeight(4535.92, 'imperial')).toBe('10.0k lb');
    });

    it('defaults to metric units', () => {
      expect(formatWeight(10)).toBe('10 kg');
    });
  });
});
