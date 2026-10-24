import {
  type ExerciseInWorkout,
  type Equipment,
  type Exercise,
  type MuscleGroup,
  type Routine,
  type WorkoutSession,
  type UserStats,
  type WorkoutSet,
  type LogPastWorkoutInput,
} from '../../types';
import { type SessionBlocksUpdate } from './WorkoutContext.actions';

export interface RestTimerState {
  isActive: boolean;
  remainingSeconds: number;
  initialSeconds: number;
  /** When the rest ends (epoch ms; 0 when inactive). `remainingSeconds` is recounted from it. */
  endsAt: number;
  /** Used to display the translated name of built-in exercises. */
  exerciseId?: string;
  exerciseName?: string;
}

export interface WorkoutContextType {
  exercises: Exercise[];
  routines: Routine[];
  history: WorkoutSession[];
  stats: UserStats;
  activeWorkout: WorkoutSession | null;
  workoutDuration: number;
  restTimer: RestTimerState;
  /** True while the initial Firestore fetch is in flight. */
  isCloudSyncing: boolean;
  /** Re-downloads Firestore data; resolves to false if any request failed. */
  refreshFromCloud: () => Promise<boolean>;

  // Actions
  startWorkout: (routine?: Routine) => void;
  finishWorkout: () => WorkoutSession | null;
  cancelWorkout: () => void;
  addExerciseToActiveWorkout: (
    exercise: Exercise,
    equipmentOverride?: Equipment,
    categoryOverride?: MuscleGroup,
  ) => void;
  removeExerciseFromActiveWorkout: (itemWorkoutId: string) => void;
  /** Undo a removal: puts the exercise back at `index` with its sets. */
  restoreExerciseToActiveWorkout: (
    item: ExerciseInWorkout,
    index: number,
  ) => void;
  addSet: (itemWorkoutId: string) => void;
  removeSet: (itemWorkoutId: string, setId: string) => void;
  updateSet: (
    itemWorkoutId: string,
    setId: string,
    updates: Partial<WorkoutSet>,
  ) => void;
  toggleSetComplete: (itemWorkoutId: string, setId: string) => void;
  /** Adjusts warmup/cooldown minutes for the active workout (0 removes block). */
  updateActiveWorkoutBlocks: (blocks: SessionBlocksUpdate) => void;
  startRestTimer: (seconds: number, exerciseName?: string) => void;
  stopRestTimer: () => void;
  adjustRestTimer: (deltaSeconds: number) => void;
  createRoutine: (routine: Omit<Routine, 'id' | 'createdAt'>) => Routine;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  loadStarterRoutines: () => void;
  createExercise: (exercise: Omit<Exercise, 'id'>) => Exercise;
  /** Saves changes to a custom exercise. */
  updateExercise: (exercise: Exercise) => void;
  /** Deletes a custom exercise (history retains its copied data). */
  deleteExercise: (exerciseId: string) => void;
  logPastWorkout: (input: LogPastWorkoutInput) => WorkoutSession;
  updateWorkoutSession: (session: WorkoutSession) => void;
  deleteWorkoutSession: (sessionId: string) => void;
  updateWeeklyGoal: (days: number, targetDays?: number[]) => void;
}
