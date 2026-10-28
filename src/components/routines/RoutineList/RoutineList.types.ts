export interface RoutineListProps {
  routines: {
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
    }[];
    warmupMinutes?: number;
    cooldownMinutes?: number;
    createdAt: string;
  }[];
  onStartRoutine: (routine: RoutineListProps['routines'][number]) => void;
  onEditRoutine?: (routine: RoutineListProps['routines'][number]) => void;
  onDeleteRoutine?: (routineId: string) => void;
  onCreateRoutine?: () => void;
}
