import {
  type BuiltInEquipment,
  type Equipment,
  type Exercise,
  type MuscleGroup,
  type WorkoutType,
} from '../types';

/** Exercise picker options (stored values remain in Spanish; translated upon display). */

/** Library and search filters: multiple values per group (OR); groups are combined (AND). */
export interface ExerciseFilters {
  types: WorkoutType[];
  muscles: MuscleGroup[];
  equipment: Equipment[];
}
export type ExerciseFilterGroup = keyof ExerciseFilters;
export const EMPTY_EXERCISE_FILTERS: ExerciseFilters = {
  types: [],
  muscles: [],
  equipment: [],
};
export const hasActiveFilters = (filters: ExerciseFilters) =>
  filters.types.length + filters.muscles.length + filters.equipment.length > 0;

/** Exercise workout types (multi-select). */
export const WORKOUT_TYPES: WorkoutType[] = [
  'functional',
  'crossfit',
  'hiit',
  'strength',
  'cardio',
];

/** Selectable muscle groups (multi-select). Training disciplines belong in WORKOUT_TYPES. */
export const MUSCLE_GROUP_OPTIONS: MuscleGroup[] = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
  'glutes',
  'full_body',
];

/** Selectable equipment (excluding legacy 'bodyweight'). */
export const EQUIPMENT_OPTIONS: BuiltInEquipment[] = [
  'none',
  'barbell',
  'dumbbells',
  'kettlebell',
  'cable',
  'machine',
  'bench',
  'pullup_bar',
  'parallel_bars',
  'plyo_box',
  'step',
  'medicine_ball',
  'jump_rope',
  'resistance_band',
  'ab_wheel',
  'battle_ropes',
  'sandbag',
  'trx',
  'sled',
  'exercise_bike',
  'rowing_machine',
  'ski_erg',
];

/** Built-in values no longer offered in new selections but possibly present in legacy data. */
const LEGACY_EQUIPMENT: BuiltInEquipment[] = [
  'bodyweight',
  'ergometer',
  'gymnastic_rings',
  'Corporal',
  'Ergómetro',
  'Anillas',
  'Sin equipamiento',
  'Barra',
  'Mancuernas',
  'Kettlebell',
  'Polea',
  'Máquina',
  'Banco',
  'Barra de dominadas',
  'Paralelas',
  'Cajón',
  'Step',
  'Balón Medicinal',
  'Soga',
  'Banda elástica',
  'Rueda abdominal',
  'Cuerdas de batalla',
  'Saco de arena',
  'TRX',
  'Trineo',
  'Bicicleta fija',
  'Máquina de remo',
  'Máquina de ski',
];

export const isBuiltInEquipment = (value: string): boolean =>
  EQUIPMENT_OPTIONS.includes(value) || LEGACY_EQUIPMENT.includes(value);

/**
 * Equipment options: built-ins followed by unique user-created options
 * present in the user's exercise library, sorted alphabetically.
 */
export const equipmentOptions = (
  exercises: Pick<Exercise, 'equipment' | 'suggestedEquipment'>[],
): Equipment[] => {
  const custom = new Set<string>();
  exercises.forEach(ex =>
    [ex.equipment, ...(ex.suggestedEquipment ?? [])].forEach(eq => {
      const value = eq?.trim();
      if (value && !isBuiltInEquipment(value)) custom.add(value);
    }),
  );
  return [
    ...EQUIPMENT_OPTIONS,
    ...[...custom].sort((a, b) => a.localeCompare(b)),
  ];
};
