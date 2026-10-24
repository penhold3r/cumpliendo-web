import {
  type Exercise,
  type Routine,
  type UserStats,
  type WorkoutSession,
} from '../../types';
import { INITIAL_EXERCISES } from '../../data/exercises';
import { INITIAL_ROUTINES } from '../../data/routines';
import { INITIAL_HISTORY, INITIAL_STATS } from '../../data/initialData';
import { type RestTimerState } from './WorkoutContext.types';

export interface WorkoutState {
  exercises: Exercise[];
  routines: Routine[];
  history: WorkoutSession[];
  stats: UserStats;
  activeWorkout: WorkoutSession | null;
  workoutDuration: number;
  restTimer: RestTimerState;
  /** True once local storage has been read; gates persistence writes. */
  isHydrated: boolean;
  /** True until the first Firestore fetch settles (success or failure). */
  isCloudSyncing: boolean;
}

export const INITIAL_REST_TIMER: RestTimerState = {
  isActive: false,
  remainingSeconds: 0,
  initialSeconds: 0,
  endsAt: 0,
};

export const initialWorkoutState: WorkoutState = {
  exercises: INITIAL_EXERCISES,
  routines: INITIAL_ROUTINES,
  history: INITIAL_HISTORY,
  stats: INITIAL_STATS,
  activeWorkout: null,
  workoutDuration: 0,
  restTimer: INITIAL_REST_TIMER,
  isHydrated: false,
  isCloudSyncing: true,
};
