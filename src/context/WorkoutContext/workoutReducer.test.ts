import { describe, expect, it } from 'vitest';
import { workoutReducer } from './WorkoutContext.reducer';
import { initialWorkoutState } from './WorkoutContext.state';
import { type WorkoutAction } from './WorkoutContext.actions';
import {
  type Exercise,
  type ExerciseInWorkout,
  type Routine,
  type WorkoutSession,
  type WorkoutSet,
} from '../../types';
import { INITIAL_ROUTINES } from '../../data/routines';

const now = 1_700_000_000_000;

const testExercise: Exercise = {
  id: 'ex-test-1',
  name: 'Test Exercise',
  category: 'chest',
  muscles: ['chest'],
  equipment: 'barbell',
  suggestedEquipment: ['dumbbells'],
  defaultRestSeconds: 90,
};

const testRoutine: Routine = {
  id: 'routine-test-1',
  name: 'Test Routine',
  description: 'A test routine',
  category: 'strength',
  estimatedMinutes: 45,
  exercises: [
    {
      exerciseId: 'ex-test-1',
      defaultSets: 3,
      defaultReps: 10,
      defaultWeightKg: 60,
    },
  ],
  createdAt: new Date(now).toISOString(),
};

const testSet: WorkoutSet = {
  id: 'set-1',
  setNumber: 1,
  weightKg: 60,
  reps: 10,
  completed: false,
};

const testExerciseInWorkout: ExerciseInWorkout = {
  id: 'item-1',
  exerciseId: 'ex-test-1',
  exerciseName: 'Test Exercise',
  category: 'chest',
  equipment: 'barbell',
  sets: [testSet],
};

const testSession: WorkoutSession = {
  id: 'session-1',
  routineName: 'Test Routine',
  startedAt: new Date(now).toISOString(),
  durationSeconds: 0,
  totalVolumeKg: 0,
  completedSets: 0,
  totalSets: 1,
  exercises: [testExerciseInWorkout],
};

describe('workoutReducer', () => {
  describe('immutability', () => {
    it('does not mutate state on any action', () => {
      const state = { ...initialWorkoutState };
      const actions: WorkoutAction[] = [
        { type: 'TICK_DURATION', now },
        { type: 'START_WORKOUT', routine: testRoutine, now },
        { type: 'CANCEL_WORKOUT' },
        { type: 'ADD_ROUTINE', routine: testRoutine },
        { type: 'ADD_EXERCISE', exercise: testExercise },
        { type: 'UPDATE_WEEKLY_GOAL', days: 5 },
      ];

      for (const action of actions) {
        const before = JSON.stringify(state);
        workoutReducer(state, action);
        const after = JSON.stringify(state);
        expect(before).toBe(after);
      }
    });
  });

  describe('HYDRATE_LOCAL', () => {
    it('hydrates all slices from payload', () => {
      const action: WorkoutAction = {
        type: 'HYDRATE_LOCAL',
        payload: {
          exercises: [testExercise],
          routines: [testRoutine],
          history: [testSession],
          stats: {
            currentStreak: 5,
            bestStreak: 10,
            weeklyGoalDays: 4,
            completedThisWeek: 3,
            totalWorkouts: 20,
            totalVolumeKg: 10000,
            lastWorkoutDate: '2024-01-01',
            targetWeekdays: [1, 3, 5],
          },
          activeWorkout: testSession,
          workoutDuration: 300,
        },
      };

      const state = workoutReducer(initialWorkoutState, action);

      expect(state.exercises).toEqual([testExercise]);
      expect(state.routines).toEqual([testRoutine]);
      expect(state.history).toEqual([testSession]);
      expect(state.stats.currentStreak).toBe(5);
      expect(state.activeWorkout).toEqual(testSession);
      expect(state.workoutDuration).toBe(300);
      expect(state.isHydrated).toBe(true);
    });

    it('keeps existing values when payload omits them', () => {
      const action: WorkoutAction = {
        type: 'HYDRATE_LOCAL',
        payload: { exercises: [testExercise] },
      };

      const state = workoutReducer(initialWorkoutState, action);

      expect(state.exercises).toEqual([testExercise]);
      expect(state.routines).toEqual(INITIAL_ROUTINES);
      expect(state.isHydrated).toBe(true);
    });
  });

  describe('HYDRATE_CLOUD', () => {
    it('hydrates from cloud and recalculates stats', () => {
      const action: WorkoutAction = {
        type: 'HYDRATE_CLOUD',
        payload: {
          routines: [testRoutine],
          history: [testSession],
        },
      };

      const state = workoutReducer(initialWorkoutState, action);

      expect(state.routines).toEqual([testRoutine]);
      expect(state.history).toEqual([testSession]);
      expect(state.isCloudSyncing).toBe(false);
    });
  });

  describe('timers', () => {
    it('TICK_DURATION updates workoutDuration', () => {
      const started = new Date(now - 300000).toISOString(); // 5 min ago
      const state = {
        ...initialWorkoutState,
        activeWorkout: { ...testSession, startedAt: started },
        workoutDuration: 0,
      };
      const action: WorkoutAction = { type: 'TICK_DURATION', now: now + 60000 };

      const next = workoutReducer(state, action);

      expect(next.workoutDuration).toBe(360);
    });

    it('TICK_DURATION returns same state when unchanged', () => {
      const state = { ...initialWorkoutState, workoutDuration: 100 };
      const action: WorkoutAction = { type: 'TICK_DURATION', now };

      const next = workoutReducer(state, action);
      expect(next).toBe(state);
    });

    it('START_REST_TIMER starts the timer', () => {
      const action: WorkoutAction = {
        type: 'START_REST_TIMER',
        seconds: 60,
        exerciseName: 'Test',
        now,
      };

      const state = workoutReducer(initialWorkoutState, action);

      expect(state.restTimer.isActive).toBe(true);
      expect(state.restTimer.remainingSeconds).toBe(60);
      expect(state.restTimer.exerciseName).toBe('Test');
    });

    it('STOP_REST_TIMER resets the timer', () => {
      const state = {
        ...initialWorkoutState,
        restTimer: { isActive: true, remainingSeconds: 30, initialSeconds: 60, endsAt: now + 30000, exerciseName: 'Test' },
      };
      const action: WorkoutAction = { type: 'STOP_REST_TIMER' };

      const next = workoutReducer(state, action);
      expect(next.restTimer.isActive).toBe(false);
      expect(next.restTimer.remainingSeconds).toBe(0);
    });

    it('ADJUST_REST_TIMER shifts end time', () => {
      const state = {
        ...initialWorkoutState,
        restTimer: {
          isActive: true,
          remainingSeconds: 60,
          initialSeconds: 60,
          endsAt: now + 60000,
          exerciseName: 'Test',
        },
      };
      const action: WorkoutAction = { type: 'ADJUST_REST_TIMER', deltaSeconds: 30, now };

      const next = workoutReducer(state, action);
      expect(next.restTimer.initialSeconds).toBe(90);
      expect(next.restTimer.remainingSeconds).toBe(90);
    });
  });

  describe('active workout', () => {
    it('START_WORKOUT creates active workout from routine', () => {
      const action: WorkoutAction = { type: 'START_WORKOUT', routine: testRoutine, now };

      const state = workoutReducer(initialWorkoutState, action);

      expect(state.activeWorkout).not.toBeNull();
      expect(state.activeWorkout?.routineName).toBe('Test Routine');
      expect(state.activeWorkout?.exercises).toHaveLength(1);
      expect(state.workoutDuration).toBe(0);
    });

    it('START_WORKOUT without routine creates free workout', () => {
      const action: WorkoutAction = { type: 'START_WORKOUT', now };

      const state = workoutReducer(initialWorkoutState, action);

      expect(state.activeWorkout?.routineName).toBe('Entrenamiento Libre');
    });

    it('FINISH_WORKOUT clears active workout and adds to history', () => {
      const state = {
        ...initialWorkoutState,
        activeWorkout: testSession,
        stats: {
          ...initialWorkoutState.stats,
          totalWorkouts: 5,
          totalVolumeKg: 5000,
        },
      };
      const action: WorkoutAction = {
        type: 'FINISH_WORKOUT',
        session: { ...testSession, id: 'session-finished' },
      };

      const next = workoutReducer(state, action);

      expect(next.activeWorkout).toBeNull();
      expect(next.history).toHaveLength(1);
      expect(next.history[0].id).toBe('session-finished');
      expect(next.workoutDuration).toBe(0);
      expect(next.restTimer.isActive).toBe(false);
    });

    it('CANCEL_WORKOUT clears active workout without adding to history', () => {
      const state = { ...initialWorkoutState, activeWorkout: testSession };
      const action: WorkoutAction = { type: 'CANCEL_WORKOUT' };

      const next = workoutReducer(state, action);

      expect(next.activeWorkout).toBeNull();
      expect(next.history).toHaveLength(0);
    });

    it('ADD_EXERCISE_TO_ACTIVE adds exercise with empty set', () => {
      const state = {
        ...initialWorkoutState,
        activeWorkout: { ...testSession, exercises: [] },
        exercises: [testExercise],
      };
      const action: WorkoutAction = {
        type: 'ADD_EXERCISE_TO_ACTIVE',
        exercise: testExercise,
        now,
      };

      const next = workoutReducer(state, action);

      expect(next.activeWorkout?.exercises).toHaveLength(1);
      expect(next.activeWorkout?.exercises[0].sets).toHaveLength(1);
      expect(next.activeWorkout?.exercises[0].sets[0].weightKg).toBe(0);
      expect(next.activeWorkout?.exercises[0].sets[0].completed).toBe(false);
      expect(next.activeWorkout?.totalSets).toBe(2); // 1 existing + 1 new
    });

    it('REMOVE_EXERCISE_FROM_ACTIVE removes exercise and decrements counts', () => {
      const target = { ...testExerciseInWorkout, sets: [{ ...testSet, completed: true }] };
      const state = {
        ...initialWorkoutState,
        activeWorkout: {
          ...testSession,
          totalSets: 3,
          completedSets: 2,
          exercises: [target],
        },
      };
      const action: WorkoutAction = {
        type: 'REMOVE_EXERCISE_FROM_ACTIVE',
        itemWorkoutId: 'item-1',
      };

      const next = workoutReducer(state, action);

      expect(next.activeWorkout?.exercises).toHaveLength(0);
      expect(next.activeWorkout?.totalSets).toBe(2);
      expect(next.activeWorkout?.completedSets).toBe(1);
    });

    it('ADD_SET adds a set repeating the last set values', () => {
      const state = {
        ...initialWorkoutState,
        activeWorkout: {
          ...testSession,
          exercises: [
            {
              ...testExerciseInWorkout,
              sets: [{ ...testSet, weightKg: 80, reps: 12 }],
            },
          ],
          totalSets: 1,
        },
      };
      const action: WorkoutAction = {
        type: 'ADD_SET',
        itemWorkoutId: 'item-1',
        now,
      };

      const next = workoutReducer(state, action);

      const sets = next.activeWorkout?.exercises[0]?.sets ?? [];
      expect(sets).toHaveLength(2);
      expect(sets[1]!.weightKg).toBe(80);
      expect(sets[1]!.reps).toBe(12);
      expect(sets[1]!.completed).toBe(false);
      expect(next.activeWorkout?.totalSets).toBe(2);
    });

    it('REMOVE_SET removes a set and renumbers remaining', () => {
      const state = {
        ...initialWorkoutState,
        activeWorkout: {
          ...testSession,
          exercises: [
            {
              ...testExerciseInWorkout,
              sets: [
                { ...testSet, id: 'set-1', setNumber: 1 },
                { ...testSet, id: 'set-2', setNumber: 2, weightKg: 70, reps: 8 },
              ],
            },
          ],
          totalSets: 2,
        },
      };
      const action: WorkoutAction = {
        type: 'REMOVE_SET',
        itemWorkoutId: 'item-1',
        setId: 'set-1',
      };

      const next = workoutReducer(state, action);

      const sets = next.activeWorkout?.exercises[0]?.sets ?? [];
      expect(sets).toHaveLength(1);
      expect(sets[0]!.setNumber).toBe(1);
      expect(sets[0]!.weightKg).toBe(70);
      expect(next.activeWorkout?.totalSets).toBe(1);
    });

    it('UPDATE_SET updates specific set fields', () => {
      const state = {
        ...initialWorkoutState,
        activeWorkout: {
          ...testSession,
          exercises: [testExerciseInWorkout],
        },
      };
      const action: WorkoutAction = {
        type: 'UPDATE_SET',
        itemWorkoutId: 'item-1',
        setId: 'set-1',
        updates: { weightKg: 90, reps: 8 },
      };

      const next = workoutReducer(state, action);

      expect(next.activeWorkout?.exercises[0].sets[0].weightKg).toBe(90);
      expect(next.activeWorkout?.exercises[0].sets[0].reps).toBe(8);
    });

    it('TOGGLE_SET_COMPLETE marks set complete and starts rest timer', () => {
      const state = {
        ...initialWorkoutState,
        activeWorkout: testSession,
        exercises: [testExercise],
      };
      const action: WorkoutAction = {
        type: 'TOGGLE_SET_COMPLETE',
        itemWorkoutId: 'item-1',
        setId: 'set-1',
        now,
      };

      const next = workoutReducer(state, action);

      expect(next.activeWorkout?.exercises[0].sets[0].completed).toBe(true);
      expect(next.activeWorkout?.completedSets).toBe(1);
      expect(next.restTimer.isActive).toBe(true);
      expect(next.restTimer.remainingSeconds).toBe(90);
    });

    it('UPDATE_ACTIVE_BLOCKS updates warmup/cooldown', () => {
      const state = { ...initialWorkoutState, activeWorkout: testSession };
      const action: WorkoutAction = {
        type: 'UPDATE_ACTIVE_BLOCKS',
        blocks: { warmupMinutes: 5, cooldownMinutes: 10 },
      };

      const next = workoutReducer(state, action);

      expect(next.activeWorkout?.warmupMinutes).toBe(5);
      expect(next.activeWorkout?.cooldownMinutes).toBe(10);
    });
  });

  describe('library', () => {
    it('ADD_ROUTINE prepends routine', () => {
      const action: WorkoutAction = { type: 'ADD_ROUTINE', routine: testRoutine };
      const next = workoutReducer(initialWorkoutState, action);
      expect(next.routines[0]).toEqual(testRoutine);
    });

    it('UPDATE_ROUTINE replaces matching routine', () => {
      const state = { ...initialWorkoutState, routines: [testRoutine] };
      const updated = { ...testRoutine, name: 'Updated Name' };
      const action: WorkoutAction = { type: 'UPDATE_ROUTINE', routine: updated };
      const next = workoutReducer(state, action);
      expect(next.routines[0].name).toBe('Updated Name');
    });

    it('DELETE_ROUTINE removes matching routine', () => {
      const state = { ...initialWorkoutState, routines: [testRoutine] };
      const action: WorkoutAction = { type: 'DELETE_ROUTINE', routineId: 'routine-test-1' };
      const next = workoutReducer(state, action);
      expect(next.routines).toHaveLength(0);
    });

    it('SET_ROUTINES replaces all routines', () => {
      const action: WorkoutAction = { type: 'SET_ROUTINES', routines: [testRoutine] };
      const next = workoutReducer(initialWorkoutState, action);
      expect(next.routines).toEqual([testRoutine]);
    });

    it('ADD_EXERCISE appends exercise', () => {
      const action: WorkoutAction = { type: 'ADD_EXERCISE', exercise: testExercise };
      const next = workoutReducer(initialWorkoutState, action);
      expect(next.exercises).toContainEqual(testExercise);
    });

    it('UPDATE_EXERCISE replaces matching exercise', () => {
      const state = { ...initialWorkoutState, exercises: [testExercise] };
      const updated = { ...testExercise, name: 'Updated Exercise' };
      const action: WorkoutAction = { type: 'UPDATE_EXERCISE', exercise: updated };
      const next = workoutReducer(state, action);
      expect(next.exercises[0].name).toBe('Updated Exercise');
    });

    it('DELETE_EXERCISE removes matching exercise', () => {
      const state = { ...initialWorkoutState, exercises: [testExercise] };
      const action: WorkoutAction = { type: 'DELETE_EXERCISE', exerciseId: 'ex-test-1' };
      const next = workoutReducer(state, action);
      expect(next.exercises).toHaveLength(0);
    });
  });

  describe('history', () => {
    it('LOG_PAST_WORKOUT adds session to history', () => {
      const action: WorkoutAction = {
        type: 'LOG_PAST_WORKOUT',
        session: testSession,
        isEditing: false,
        workoutDate: new Date(now).toISOString(),
      };
      const next = workoutReducer(initialWorkoutState, action);
      expect(next.history).toHaveLength(1);
      expect(next.history[0].id).toBe('session-1');
    });

    it('UPDATE_SESSION replaces matching session in history', () => {
      const state = { ...initialWorkoutState, history: [testSession] };
      const updated = { ...testSession, routineName: 'Updated' };
      const action: WorkoutAction = { type: 'UPDATE_SESSION', session: updated };
      const next = workoutReducer(state, action);
      expect(next.history[0].routineName).toBe('Updated');
    });

    it('DELETE_SESSION removes matching session', () => {
      const state = { ...initialWorkoutState, history: [testSession] };
      const action: WorkoutAction = { type: 'DELETE_SESSION', sessionId: 'session-1' };
      const next = workoutReducer(state, action);
      expect(next.history).toHaveLength(0);
    });
  });

  describe('stats', () => {
    it('UPDATE_WEEKLY_GOAL updates weeklyGoalDays and recalculates stats', () => {
      const state = {
        ...initialWorkoutState,
        stats: { ...initialWorkoutState.stats, weeklyGoalDays: 3 },
        history: [testSession],
      };
      const action: WorkoutAction = { type: 'UPDATE_WEEKLY_GOAL', days: 5 };
      const next = workoutReducer(state, action);
      expect(next.stats.weeklyGoalDays).toBe(5);
    });
  });
});
