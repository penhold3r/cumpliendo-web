import { i18n } from '../i18n';
/**
 * Weight units. Data is always stored in kg; conversion is strictly for display
 * and user input according to user preferences.
 */
export type WeightUnits = 'metric' | 'imperial';

export const LB_PER_KG = 2.20462;

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Stored kg → displayed number in chosen unit (at most 1 decimal place). */
export const toDisplayWeight = (kg: number, units: WeightUnits): number =>
  round1(units === 'imperial' ? kg * LB_PER_KG : kg);

/** Input value in chosen unit → stored kg. */
export const fromDisplayWeight = (value: number, units: WeightUnits): number =>
  units === 'imperial' ? value / LB_PER_KG : value;

export const weightUnitLabel = (units: WeightUnits): string =>
  units === 'imperial' ? 'lb' : 'kg';

/** Human-readable weight or volume: "80 kg", "2.5 t" / "176 lb", "5.5k lb". */
export const formatWeight = (
  kg: number,
  units: WeightUnits = 'metric',
): string => {
  if (units === 'imperial') {
    const lb = kg * LB_PER_KG;
    return lb >= 1000
      ? `${(lb / 1000).toFixed(1)}k lb`
      : `${round1(lb).toLocaleString()} lb`;
  }
  return kg >= 1000
    ? `${(kg / 1000).toFixed(1)} ${i18n.t('units.tonnes')}`
    : `${round1(kg).toLocaleString()} kg`;
};
