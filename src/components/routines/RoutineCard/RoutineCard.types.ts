export interface RoutineCardProps {
  routine: {
    id: string;
    name: string;
    description: string;
    category: string;
    estimatedMinutes: number;
    exercises: {
      exerciseId: string;
      defaultSets: number;
      defaultReps: number;
      defaultWeightKg: number;
      equipment?: string;
      category?: string;
      supersetId?: string;
      setsMax?: number;
      repsMax?: number;
      toFailure?: boolean;
      perSide?: boolean;
      cue?: string;
    }[];
    warmupMinutes?: number;
    cooldownMinutes?: number;
    createdAt: string;
  };
  onStartRoutine: (routine: RoutineCardProps['routine']) => void;
  onEditRoutine?: (routine: RoutineCardProps['routine']) => void;
  onDeleteRoutine?: (routineId: string) => void;
}
