import {
  type ExerciseInWorkout,
  type Equipment,
  type Exercise,
  type MuscleGroup,
  type Routine,
  type UserStats,
  type WorkoutSession,
  type WorkoutSet,
} from '../../types';

/** Warmup/cooldown block minutes to update on the active workout. */
export interface SessionBlocksUpdate {
  warmupMinutes?: number;
  cooldownMinutes?: number;
}

export interface HydratePayload {
  exercises?: Exercise[];
  routines?: Routine[];
  history?: WorkoutSession[];
  stats?: UserStats;
}

export type WorkoutAction =
  // Hydration
  | {
      type: 'HYDRATE_LOCAL';
      payload: HydratePayload & {
        activeWorkout?: WorkoutSession | null;
        workoutDuration?: number;
      };
    }
  | { type: 'HYDRATE_CLOUD'; payload: HydratePayload }
  // Timers
  | { type: 'TICK_DURATION'; now: number }
  | { type: 'TICK_REST_TIMER'; now: number }
  | {
      type: 'START_REST_TIMER';
      seconds: number;
      exerciseName?: string;
      now: number;
    }
  | { type: 'STOP_REST_TIMER' }
  | { type: 'ADJUST_REST_TIMER'; deltaSeconds: number; now: number }
  // Active workout
  | { type: 'START_WORKOUT'; routine?: Routine; now: number }
  | { type: 'FINISH_WORKOUT'; session: WorkoutSession }
  | { type: 'CANCEL_WORKOUT' }
  | {
      type: 'ADD_EXERCISE_TO_ACTIVE';
      exercise: Exercise;
      equipmentOverride?: Equipment;
      categoryOverride?: MuscleGroup;
      now: number;
    }
  | { type: 'REMOVE_EXERCISE_FROM_ACTIVE'; itemWorkoutId: string }
  | {
      type: 'RESTORE_EXERCISE_TO_ACTIVE';
      item: ExerciseInWorkout;
      index: number;
    }
  | { type: 'ADD_SET'; itemWorkoutId: string; now: number }
  | { type: 'REMOVE_SET'; itemWorkoutId: string; setId: string }
  | {
      type: 'UPDATE_SET';
      itemWorkoutId: string;
      setId: string;
      updates: Partial<WorkoutSet>;
    }
  | {
      type: 'TOGGLE_SET_COMPLETE';
      itemWorkoutId: string;
      setId: string;
      now: number;
    }
  | { type: 'UPDATE_ACTIVE_BLOCKS'; blocks: SessionBlocksUpdate }
  // Library
  | { type: 'ADD_ROUTINE'; routine: Routine }
  | { type: 'UPDATE_ROUTINE'; routine: Routine }
  | { type: 'DELETE_ROUTINE'; routineId: string }
  | { type: 'SET_ROUTINES'; routines: Routine[] }
  | { type: 'ADD_EXERCISE'; exercise: Exercise }
  | { type: 'UPDATE_EXERCISE'; exercise: Exercise }
  | { type: 'DELETE_EXERCISE'; exerciseId: string }
  // History
  | {
      type: 'LOG_PAST_WORKOUT';
      session: WorkoutSession;
      isEditing: boolean;
      workoutDate: string;
    }
  | { type: 'UPDATE_SESSION'; session: WorkoutSession }
  | { type: 'DELETE_SESSION'; sessionId: string }
  // Stats
  | { type: 'UPDATE_WEEKLY_GOAL'; days: number; targetDays?: number[] };

export const workoutActions = {
  hydrateLocal: (
    payload: Extract<WorkoutAction, { type: 'HYDRATE_LOCAL' }>['payload'],
  ): WorkoutAction => ({
    type: 'HYDRATE_LOCAL',
    payload,
  }),
  hydrateCloud: (payload: HydratePayload): WorkoutAction => ({
    type: 'HYDRATE_CLOUD',
    payload,
  }),
  // Timers read the clock: ticks only trigger a recount, so a paused JS thread
  // (app in the background) never makes them drift
  tickDuration: (now = Date.now()): WorkoutAction => ({
    type: 'TICK_DURATION',
    now,
  }),
  tickRestTimer: (now = Date.now()): WorkoutAction => ({
    type: 'TICK_REST_TIMER',
    now,
  }),
  startRestTimer: (
    seconds: number,
    exerciseName?: string,
    now = Date.now(),
  ): WorkoutAction => ({
    type: 'START_REST_TIMER',
    seconds,
    exerciseName,
    now,
  }),
  stopRestTimer: (): WorkoutAction => ({ type: 'STOP_REST_TIMER' }),
  adjustRestTimer: (deltaSeconds: number, now = Date.now()): WorkoutAction => ({
    type: 'ADJUST_REST_TIMER',
    deltaSeconds,
    now,
  }),
  startWorkout: (routine?: Routine): WorkoutAction => ({
    type: 'START_WORKOUT',
    routine,
    now: Date.now(),
  }),
  finishWorkout: (session: WorkoutSession): WorkoutAction => ({
    type: 'FINISH_WORKOUT',
    session,
  }),
  cancelWorkout: (): WorkoutAction => ({ type: 'CANCEL_WORKOUT' }),
  addExerciseToActive: (
    exercise: Exercise,
    equipmentOverride?: Equipment,
    categoryOverride?: MuscleGroup,
  ): WorkoutAction => ({
    type: 'ADD_EXERCISE_TO_ACTIVE',
    exercise,
    equipmentOverride,
    categoryOverride,
    now: Date.now(),
  }),
  removeExerciseFromActive: (itemWorkoutId: string): WorkoutAction => ({
    type: 'REMOVE_EXERCISE_FROM_ACTIVE',
    itemWorkoutId,
  }),
  restoreExerciseToActive: (
    item: ExerciseInWorkout,
    index: number,
  ): WorkoutAction => ({
    type: 'RESTORE_EXERCISE_TO_ACTIVE',
    item,
    index,
  }),
  addSet: (itemWorkoutId: string): WorkoutAction => ({
    type: 'ADD_SET',
    itemWorkoutId,
    now: Date.now(),
  }),
  updateActiveBlocks: (blocks: SessionBlocksUpdate): WorkoutAction => ({
    type: 'UPDATE_ACTIVE_BLOCKS',
    blocks,
  }),
  removeSet: (itemWorkoutId: string, setId: string): WorkoutAction => ({
    type: 'REMOVE_SET',
    itemWorkoutId,
    setId,
  }),
  updateSet: (
    itemWorkoutId: string,
    setId: string,
    updates: Partial<WorkoutSet>,
  ): WorkoutAction => ({ type: 'UPDATE_SET', itemWorkoutId, setId, updates }),
  toggleSetComplete: (
    itemWorkoutId: string,
    setId: string,
    now = Date.now(),
  ): WorkoutAction => ({
    type: 'TOGGLE_SET_COMPLETE',
    itemWorkoutId,
    setId,
    now,
  }),
  addRoutine: (routine: Routine): WorkoutAction => ({
    type: 'ADD_ROUTINE',
    routine,
  }),
  updateRoutine: (routine: Routine): WorkoutAction => ({
    type: 'UPDATE_ROUTINE',
    routine,
  }),
  deleteRoutine: (routineId: string): WorkoutAction => ({
    type: 'DELETE_ROUTINE',
    routineId,
  }),
  setRoutines: (routines: Routine[]): WorkoutAction => ({
    type: 'SET_ROUTINES',
    routines,
  }),
  addExercise: (exercise: Exercise): WorkoutAction => ({
    type: 'ADD_EXERCISE',
    exercise,
  }),
  updateExercise: (exercise: Exercise): WorkoutAction => ({
    type: 'UPDATE_EXERCISE',
    exercise,
  }),
  deleteExercise: (exerciseId: string): WorkoutAction => ({
    type: 'DELETE_EXERCISE',
    exerciseId,
  }),
  logPastWorkout: (
    session: WorkoutSession,
    isEditing: boolean,
    workoutDate: string,
  ): WorkoutAction => ({
    type: 'LOG_PAST_WORKOUT',
    session,
    isEditing,
    workoutDate,
  }),
  updateSession: (session: WorkoutSession): WorkoutAction => ({
    type: 'UPDATE_SESSION',
    session,
  }),
  deleteSession: (sessionId: string): WorkoutAction => ({
    type: 'DELETE_SESSION',
    sessionId,
  }),
  updateWeeklyGoal: (days: number, targetDays?: number[]): WorkoutAction => ({
    type: 'UPDATE_WEEKLY_GOAL',
    days,
    targetDays,
  }),
};
