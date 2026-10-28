const EQUIPMENT_ICON: Record<string, string> = {
  barbell: 'weight-lifter',
  dumbbells: 'dumbbell',
  kettlebell: 'kettlebell',
  cable: 'fitness-center',
  machine: 'fitness-center',
  smith_machine: 'fitness-center',
  bench: 'fitness-center',
  pullup_bar: 'human-handsup',
  dip_bars: 'human-handsup',
  rings: 'human-handsup',
  trx: 'human-handsup',
  resistance_band: 'fitness-center',
  exercise_ball: 'fitness-center',
  foam_roller: 'fitness-center',
  ab_wheel: 'fitness-center',
  stationary_bike: 'bike',
  rowing_machine: 'rowing',
  elliptical: 'run',
  treadmill: 'run',
  jump_rope: 'jump-rope',
  none: 'human',
};

const CATEGORY_ICON: Record<string, string> = {
  legs: 'run-fast',
  glutes: 'run-fast',
  chest: 'arm-flex',
  arms: 'arm-flex',
  shoulders: 'arm-flex',
  back: 'human-handsup',
  full_body: 'human-handsup',
  core: 'human',
};

export function getExerciseIcon(equipment: string, category: string): string {
  return EQUIPMENT_ICON[equipment] ?? CATEGORY_ICON[category] ?? 'dumbbell';
}
