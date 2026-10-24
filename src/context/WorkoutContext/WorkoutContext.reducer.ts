import {
  type ExerciseInWorkout,
  type WorkoutSession,
  type WorkoutSet,
} from '../../types';
import { type WorkoutAction } from './WorkoutContext.actions';
import { INITIAL_REST_TIMER, type WorkoutState } from './WorkoutContext.state';
import {
  buildStartedWorkout,
  computeCompletedTotals,
  historyAfterLogPast,
  deriveStats,
  elapsedSeconds,
  secondsUntil,
  shouldRestAfterSet,
  sortHistory,
  statsAfterFinish,
  statsAfterGoal,
  statsAfterLogPast,
  statsAfterSessionDelete,
  statsAfterSessionUpdate,
} from './WorkoutContext.utils';
import { toBlockMinutes } from '../../utils/sessionBlocks';

/** Applies a pure transformation to the active workout (no-op when none is active). */
const withActive = (
  state: WorkoutState,
  fn: (active: WorkoutSession) => WorkoutSession,
): WorkoutState => {
  if (!state.activeWorkout) return state;
  return { ...state, activeWorkout: fn(state.activeWorkout) };
};

export function workoutReducer(
  state: WorkoutState,
  action: WorkoutAction,
): WorkoutState {
  switch (action.type) {
    // Hydration
    case 'HYDRATE_LOCAL': {
      const {
        exercises,
        routines,
        history,
        stats,
        activeWorkout,
        workoutDuration,
      } = action.payload;
      return {
        ...state,
        exercises: exercises ?? state.exercises,
        routines: routines ?? state.routines,
        history: history ? sortHistory(history) : state.history,
        stats: stats ?? state.stats,
        activeWorkout:
          activeWorkout !== undefined ? activeWorkout : state.activeWorkout,
        workoutDuration:
          workoutDuration !== undefined
            ? workoutDuration
            : state.workoutDuration,
        isHydrated: true,
      };
    }
    case 'HYDRATE_CLOUD': {
      const { exercises, routines, history, stats } = action.payload;
      const nextHistory = history ? sortHistory(history) : state.history;
      return {
        ...state,
        exercises: exercises ?? state.exercises,
        routines: routines ?? state.routines,
        history: nextHistory,
        // Cloud-saved stats might be stale counters: recalculate from history
        stats: deriveStats(stats ?? state.stats, nextHistory),
        isCloudSyncing: false,
      };
    }

    // Timers
    case 'TICK_DURATION': {
      if (!state.activeWorkout) return state;
      const workoutDuration = elapsedSeconds(
        state.activeWorkout.startedAt,
        action.now,
      );
      if (workoutDuration === state.workoutDuration) return state;
      return { ...state, workoutDuration };
    }
    case 'TICK_REST_TIMER': {
      const prev = state.restTimer;
      if (!prev.isActive) return state;
      const remainingSeconds = secondsUntil(prev.endsAt, action.now);
      if (remainingSeconds <= 0) {
        return {
          ...state,
          restTimer: {
            ...prev,
            isActive: false,
            remainingSeconds: 0,
            endsAt: 0,
          },
        };
      }
      if (remainingSeconds === prev.remainingSeconds) return state;
      return { ...state, restTimer: { ...prev, remainingSeconds } };
    }
    case 'START_REST_TIMER':
      return {
        ...state,
        restTimer: {
          isActive: true,
          remainingSeconds: action.seconds,
          initialSeconds: action.seconds,
          endsAt: action.now + action.seconds * 1000,
          exerciseName: action.exerciseName,
        },
      };
    case 'STOP_REST_TIMER':
      return { ...state, restTimer: INITIAL_REST_TIMER };
    case 'ADJUST_REST_TIMER': {
      const endsAt = state.restTimer.endsAt + action.deltaSeconds * 1000;
      const nextRemaining = secondsUntil(endsAt, action.now);
      return {
        ...state,
        restTimer: {
          ...state.restTimer,
          remainingSeconds: nextRemaining,
          // +30s past the original length grows the total, so progress stays within 100%
          initialSeconds: Math.max(
            state.restTimer.initialSeconds,
            nextRemaining,
          ),
          isActive: nextRemaining > 0,
          endsAt: nextRemaining > 0 ? endsAt : 0,
        },
      };
    }

    // Active workout
    case 'START_WORKOUT':
      return {
        ...state,
        activeWorkout: buildStartedWorkout(
          action.routine,
          state.exercises,
          action.now,
        ),
        workoutDuration: 0,
      };
    case 'FINISH_WORKOUT': {
      const { session } = action;
      const updatedHistory = [session, ...state.history];
      return {
        ...state,
        history: updatedHistory,
        stats: statsAfterFinish(state.stats, updatedHistory),
        activeWorkout: null,
        workoutDuration: 0,
        restTimer: INITIAL_REST_TIMER,
      };
    }
    case 'CANCEL_WORKOUT':
      return {
        ...state,
        activeWorkout: null,
        workoutDuration: 0,
        restTimer: INITIAL_REST_TIMER,
      };
    case 'ADD_EXERCISE_TO_ACTIVE':
      return withActive(state, active => {
        const { exercise, equipmentOverride, categoryOverride, now } = action;
        const newExerciseItem: ExerciseInWorkout = {
          id: `item-${now}`,
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          category: categoryOverride ?? exercise.category,
          equipment: equipmentOverride ?? exercise.equipment,
          // Empty until the athlete types what they did: no made-up 20 kg × 10
          sets: [
            {
              id: `set-${now}-1`,
              setNumber: 1,
              weightKg: 0,
              reps: 0,
              completed: false,
            },
          ],
        };
        return {
          ...active,
          exercises: [...active.exercises, newExerciseItem],
          totalSets: active.totalSets + 1,
        };
      });
    case 'REMOVE_EXERCISE_FROM_ACTIVE':
      return withActive(state, active => {
        const target = active.exercises.find(
          e => e.id === action.itemWorkoutId,
        );
        const setsCount = target ? target.sets.length : 0;
        const completedSetsCount = target
          ? target.sets.filter(s => s.completed).length
          : 0;
        return {
          ...active,
          exercises: active.exercises.filter(
            e => e.id !== action.itemWorkoutId,
          ),
          totalSets: Math.max(0, active.totalSets - setsCount),
          completedSets: Math.max(0, active.completedSets - completedSetsCount),
        };
      });
    case 'RESTORE_EXERCISE_TO_ACTIVE':
      // Undo of a removal: back in its place, with its sets and their progress
      return withActive(state, active => {
        const exercises = [...active.exercises];
        exercises.splice(
          Math.min(action.index, exercises.length),
          0,
          action.item,
        );
        return {
          ...active,
          exercises,
          totalSets: active.totalSets + action.item.sets.length,
          completedSets:
            active.completedSets +
            action.item.sets.filter(s => s.completed).length,
        };
      });
    case 'ADD_SET':
      return withActive(state, active => ({
        ...active,
        exercises: active.exercises.map(item => {
          if (item.id !== action.itemWorkoutId) return item;
          const lastSet = item.sets[item.sets.length - 1];
          const newSet: WorkoutSet = {
            id: `set-${action.now}-${item.sets.length + 1}`,
            setNumber: item.sets.length + 1,
            // A new set repeats the one above (same load), which is how sets usually go
            weightKg: lastSet ? lastSet.weightKg : 0,
            reps: lastSet ? lastSet.reps : 0,
            weightPerSide: lastSet?.weightPerSide,
            completed: false,
          };
          return { ...item, sets: [...item.sets, newSet] };
        }),
        totalSets: active.totalSets + 1,
      }));
    case 'REMOVE_SET':
      return withActive(state, active => {
        let wasCompleted = false;
        const updatedExercises = active.exercises.map(item => {
          if (item.id !== action.itemWorkoutId) return item;
          const setToRemove = item.sets.find(s => s.id === action.setId);
          if (setToRemove?.completed) wasCompleted = true;
          const renumbered = item.sets
            .filter(s => s.id !== action.setId)
            .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
          return { ...item, sets: renumbered };
        });
        return {
          ...active,
          exercises: updatedExercises,
          totalSets: Math.max(0, active.totalSets - 1),
          completedSets: wasCompleted
            ? Math.max(0, active.completedSets - 1)
            : active.completedSets,
        };
      });
    case 'UPDATE_ACTIVE_BLOCKS':
      return withActive(state, active => ({
        ...active,
        ...('warmupMinutes' in action.blocks && {
          warmupMinutes: toBlockMinutes(action.blocks.warmupMinutes),
        }),
        ...('cooldownMinutes' in action.blocks && {
          cooldownMinutes: toBlockMinutes(action.blocks.cooldownMinutes),
        }),
      }));
    case 'UPDATE_SET':
      return withActive(state, active => ({
        ...active,
        exercises: active.exercises.map(item =>
          item.id === action.itemWorkoutId
            ? {
                ...item,
                sets: item.sets.map(s =>
                  s.id === action.setId ? { ...s, ...action.updates } : s,
                ),
              }
            : item,
        ),
      }));
    case 'TOGGLE_SET_COMPLETE': {
      const active = state.activeWorkout;
      if (!active) return state;

      let targetExerciseName = '';
      let targetExerciseId = '';
      let targetIndex = -1;
      let shouldStartTimer = false;
      let completedCountDelta = 0;

      const updatedExercises = active.exercises.map((item, index) => {
        if (item.id !== action.itemWorkoutId) return item;
        targetIndex = index;
        targetExerciseName = item.exerciseName;
        targetExerciseId = item.exerciseId;
        const sets = item.sets.map(s => {
          if (s.id !== action.setId) return s;
          const nextVal = !s.completed;
          completedCountDelta = nextVal ? 1 : -1;
          if (nextVal) shouldStartTimer = true;
          return { ...s, completed: nextVal };
        });
        return { ...item, sets };
      });

      const { totalVol } = computeCompletedTotals(updatedExercises);
      const updated: WorkoutSession = {
        ...active,
        exercises: updatedExercises,
        completedSets: Math.max(0, active.completedSets + completedCountDelta),
        totalVolumeKg: totalVol,
      };

      // No rest between the exercises of a superset: only after the last one of the round
      if (
        !shouldStartTimer ||
        !shouldRestAfterSet(updatedExercises, targetIndex)
      ) {
        return { ...state, activeWorkout: updated };
      }

      // Completing a set starts rest timer for the exercise. Look up by id: built-in exercise
      // names may vary across versions; name fallback is kept only for legacy data without id.
      const exerciseDef =
        state.exercises.find(e => e.id === targetExerciseId) ??
        state.exercises.find(e => e.name === targetExerciseName);
      const restSecs = exerciseDef ? exerciseDef.defaultRestSeconds : 90;
      return {
        ...state,
        activeWorkout: updated,
        restTimer: {
          isActive: true,
          remainingSeconds: restSecs,
          initialSeconds: restSecs,
          endsAt: action.now + restSecs * 1000,
          exerciseId: targetExerciseId || undefined,
          exerciseName: targetExerciseName,
        },
      };
    }

    // Library
    case 'ADD_ROUTINE':
      return { ...state, routines: [action.routine, ...state.routines] };
    case 'UPDATE_ROUTINE':
      return {
        ...state,
        routines: state.routines.map(r =>
          r.id === action.routine.id ? action.routine : r,
        ),
      };
    case 'DELETE_ROUTINE':
      return {
        ...state,
        routines: state.routines.filter(r => r.id !== action.routineId),
      };
    case 'SET_ROUTINES':
      return { ...state, routines: action.routines };
    case 'ADD_EXERCISE':
      return { ...state, exercises: [...state.exercises, action.exercise] };
    case 'UPDATE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.map(ex =>
          ex.id === action.exercise.id ? action.exercise : ex,
        ),
      };
    case 'DELETE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.filter(ex => ex.id !== action.exerciseId),
      };

    // History
    case 'LOG_PAST_WORKOUT': {
      const updatedHistory = historyAfterLogPast(
        state.history,
        action.session,
        action.isEditing,
      );
      return {
        ...state,
        history: updatedHistory,
        stats: statsAfterLogPast(state.stats, updatedHistory),
      };
    }
    case 'UPDATE_SESSION': {
      const updatedHistory = sortHistory(
        state.history.map(s =>
          s.id === action.session.id ? action.session : s,
        ),
      );
      return {
        ...state,
        history: updatedHistory,
        stats: statsAfterSessionUpdate(state.stats, updatedHistory),
      };
    }
    case 'DELETE_SESSION': {
      const updatedHistory = state.history.filter(
        s => s.id !== action.sessionId,
      );
      return {
        ...state,
        history: updatedHistory,
        stats: statsAfterSessionDelete(state.stats, updatedHistory),
      };
    }

    // Stats
    case 'UPDATE_WEEKLY_GOAL':
      return {
        ...state,
        stats: statsAfterGoal(
          state.stats,
          state.history,
          action.days,
          action.targetDays,
        ),
      };
  }
}
