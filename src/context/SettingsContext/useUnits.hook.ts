import { useMemo } from 'react';
import {
  formatWeight,
  fromDisplayWeight,
  toDisplayWeight,
  weightUnitLabel,
} from '@/utils/units';
import { useSettings } from './useSettings.hook';

/** Weight helpers bound to the active unit selected in Settings. */
export const useUnits = () => {
  const { units } = useSettings();
  return useMemo(
    () => ({
      units,
      unitLabel: weightUnitLabel(units),
      formatWeight: (kg: number) => formatWeight(kg, units),
      toDisplay: (kg: number) => toDisplayWeight(kg, units),
      fromDisplay: (value: number) => fromDisplayWeight(value, units),
    }),
    [units],
  );
};
