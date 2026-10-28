import {
  type Equipment,
  type ExerciseTargetOptions,
  type MuscleGroup,
  type Routine,
  type RoutineExerciseTemplate,
} from '@/types';

export interface RoutineEditorProps {
  initialRoutine?: Routine | null;
  draftExercises?: RoutineExerciseTemplate[];
  onBack: () => void;
  onSuccess: (routine: Routine) => void;
}

export const ROUTINE_CATEGORIES = [
  'strength',
  'hypertrophy',
  'endurance',
  'crossfit',
  'functional',
] as const;

export type RoutineCategory = (typeof ROUTINE_CATEGORIES)[number];

export const ESTIMATED_DURATION_PRESETS = [30, 45, 60] as const;

export interface RoutineExerciseItem extends ExerciseTargetOptions {
  exerciseId: string;
  name: string;
  equipment: Equipment;
  category: MuscleGroup;
  defaultSets: number;
  defaultReps: number;
  defaultWeightKg: number;
}
