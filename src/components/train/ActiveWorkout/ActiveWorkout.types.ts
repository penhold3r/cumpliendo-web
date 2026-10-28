export interface ActiveWorkoutProps {
  activeWorkout: {
    id: string;
    routineName: string;
    startedAt: string;
    durationSeconds: number;
    totalVolumeKg: number;
    completedSets: number;
    totalSets: number;
    exercises: {
      id: string;
      exerciseId: string;
      exerciseName: string;
      category: string;
      equipment: string;
      sets: {
        id: string;
        setNumber: number;
        weightKg: number;
        reps: number;
        completed: boolean;
      }[];
    }[];
    warmupMinutes?: number;
    cooldownMinutes?: number;
  };
  workoutDuration: number;
  onAddExercise?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
  onToggleSetComplete?: (itemWorkoutId: string, setId: string) => void;
  onUpdateSet?: (itemWorkoutId: string, setId: string, updates: { weightKg?: number; reps?: number }) => void;
}
