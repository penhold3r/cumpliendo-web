'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
} from 'react';
import {
  type Exercise,
  type Routine,
  type UserSession,
  type UserStats,
  type WorkoutSession,
} from '@/types';
import { INITIAL_EXERCISES } from '@/data/exercises';
import {
  fetchUserDataFromFirestore,
  saveStatsToFirestore,
} from '@/services/firebaseFirestoreService';
import {
  workoutActions,
  type HydratePayload,
  type WorkoutAction,
} from './WorkoutContext.actions';
import { type WorkoutState } from './WorkoutContext.state';
import { STORAGE_KEYS } from '@/constants';
import { normalizeStoredStats, totalVolumeOf } from './WorkoutContext.utils';

/** Writes (or removes, when null) a value in localStorage. */
const saveData = async (key: string, data: unknown): Promise<void> => {
  try {
    if (data === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

/**
 * Persists a slice whenever it changes after hydration. The first value seen once
 * hydrated is used as a baseline and not written, so untouched defaults are never saved.
 */
function usePersistSlice(key: string, value: unknown, enabled: boolean): void {
  const baseline = useRef<{ ready: boolean; value: unknown }>({
    ready: false,
    value: undefined,
  });

  useEffect(() => {
    if (!enabled) return;
    if (!baseline.current.ready) {
      baseline.current = { ready: true, value };
      return;
    }
    if (baseline.current.value === value) return;
    baseline.current.value = value;
    void saveData(key, value);
  }, [key, value, enabled]);
}

/**
 * Combines latest built-in exercises with any user-created custom exercises.
 */
function mergeWithBuiltInExercises(
  storedOrCloudExercises: Exercise[],
): Exercise[] {
  const builtInMap = new Map(INITIAL_EXERCISES.map(e => [e.id, e]));
  const custom = storedOrCloudExercises.filter(e => !builtInMap.has(e.id));
  return [...INITIAL_EXERCISES, ...custom];
}

/**
 * Side effects of the workout store: hydration (storage + Firestore),
 * persistence and timers. State changes go through the dispatcher.
 * Returns `syncFromCloud`, which re-downloads Firestore data on demand.
 */
export function useWorkoutEffects(
  state: WorkoutState,
  dispatch: Dispatch<WorkoutAction>,
  user: UserSession | null,
): { syncFromCloud: () => Promise<boolean> } {
  const {
    isHydrated,
    exercises,
    routines,
    history,
    stats,
    activeWorkout,
    restTimer,
  } = state;

  // Only one Firestore download at a time; concurrent callers share the same promise.
  const syncInFlight = useRef<Promise<boolean> | null>(null);

  const syncFromCloud = useCallback(async (): Promise<boolean> => {
    if (!user) {
      dispatch(workoutActions.hydrateCloud({}));
      return false;
    }
    if (!syncInFlight.current) {
      syncInFlight.current = fetchCloudData(user.uid)
        .then(({ ok, payload }) => {
          dispatch(workoutActions.hydrateCloud(payload));
          return ok;
        })
        .catch(e => {
          console.error('Error syncing with Firestore', e);
          dispatch(workoutActions.hydrateCloud({}));
          return false;
        })
        .finally(() => {
          syncInFlight.current = null;
        });
    }
    return syncInFlight.current;
  }, [user, dispatch]);

  // Load from localStorage and sync fresh data from Firestore Cloud
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const [
          storedExercises,
          storedRoutines,
          storedHistory,
          storedStats,
          storedActive,
        ] = await Promise.all([
          window.localStorage.getItem(STORAGE_KEYS.EXERCISES),
          window.localStorage.getItem(STORAGE_KEYS.ROUTINES),
          window.localStorage.getItem(STORAGE_KEYS.HISTORY),
          window.localStorage.getItem(STORAGE_KEYS.STATS),
          window.localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT),
        ]);

        let currentHistory: WorkoutSession[] = [];
        let localHistory: WorkoutSession[] | undefined;
        if (storedHistory) {
          const parsedHistory: WorkoutSession[] = JSON.parse(storedHistory);
          currentHistory = parsedHistory;
          localHistory = currentHistory;
          await saveData(STORAGE_KEYS.HISTORY, currentHistory);
        }

        let localStats: UserStats | undefined;
        if (storedStats) {
          localStats = normalizeStoredStats(
            JSON.parse(storedStats),
            currentHistory,
          );
          await saveData(STORAGE_KEYS.STATS, localStats);
        }

        let localActive: WorkoutSession | undefined;
        let localDuration: number | undefined;
        if (storedActive) {
          localActive = JSON.parse(storedActive);
          const startedAtTime = new Date(localActive?.startedAt ?? 0).getTime();
          const elapsed = Math.floor((Date.now() - startedAtTime) / 1000);
          localDuration = elapsed > 0 ? elapsed : 0;
        }

        dispatch(
          workoutActions.hydrateLocal({
            exercises: storedExercises
              ? mergeWithBuiltInExercises(JSON.parse(storedExercises))
              : undefined,
            routines: storedRoutines ? JSON.parse(storedRoutines) : undefined,
            history: localHistory,
            stats: localStats,
            activeWorkout: localActive,
            workoutDuration: localDuration,
          }),
        );

        // Auto-fetch and sync fresh data from Firestore Cloud
        await syncFromCloud();
      } catch (e) {
        console.error('Error loading data from Firestore / Storage', e);
        dispatch(workoutActions.hydrateLocal({}));
        dispatch(workoutActions.hydrateCloud({}));
      }
    };

    loadStoredData();
  }, [dispatch, syncFromCloud]);

  // Persist each slice on change
  usePersistSlice(STORAGE_KEYS.EXERCISES, exercises, isHydrated);
  usePersistSlice(STORAGE_KEYS.ROUTINES, routines, isHydrated);
  usePersistSlice(STORAGE_KEYS.HISTORY, history, isHydrated);
  usePersistSlice(STORAGE_KEYS.STATS, stats, isHydrated);
  usePersistSlice(STORAGE_KEYS.ACTIVE_WORKOUT, activeWorkout, isHydrated);

  // Workout duration counter
  const hasActiveWorkout = activeWorkout !== null;
  useEffect(() => {
    if (!hasActiveWorkout) return;
    const interval = setInterval(
      () => dispatch(workoutActions.tickDuration()),
      1000,
    );
    return () => clearInterval(interval);
  }, [hasActiveWorkout, dispatch]);

  // Rest Timer ticking
  useEffect(() => {
    if (!(restTimer.isActive && restTimer.remainingSeconds > 0)) return;
    const timeout = setTimeout(
      () => dispatch(workoutActions.tickRestTimer()),
      1000,
    );
    return () => clearTimeout(timeout);
  }, [restTimer.isActive, restTimer.remainingSeconds, dispatch]);

  return { syncFromCloud };
}

/**
 * Downloads the user's data from Firestore and returns what should replace local state.
 */
async function fetchCloudData(
  userId: string,
): Promise<{ ok: boolean; payload: HydratePayload }> {
  const cloudData = (await fetchUserDataFromFirestore(userId)) as {
    routines: unknown[];
    history: unknown[];
    exercises: unknown[];
    stats: UserStats | null;
    ok: boolean;
  } | null;
  if (!cloudData) {
    return { ok: false, payload: {} };
  }
  const cloudPayload: HydratePayload = {};

  if (cloudData.routines.length > 0) {
    cloudPayload.routines = cloudData.routines as Routine[];
  }
  if (cloudData.history.length > 0) {
    cloudPayload.history = cloudData.history as WorkoutSession[];
  }
  if (cloudData.exercises.length > 0) {
    cloudPayload.exercises = mergeWithBuiltInExercises(
      cloudData.exercises as Exercise[],
    );
  }
  if (cloudData.stats) {
    const cloudStats = cloudData.stats;
    const calculatedVol = totalVolumeOf(
      cloudPayload.history ?? [],
    );
    if (calculatedVol > cloudStats.totalVolumeKg) {
      cloudStats.totalVolumeKg = calculatedVol;
      await saveStatsToFirestore(userId, cloudStats);
    }
    cloudPayload.stats = cloudStats;
  }

  return { ok: true, payload: cloudPayload };
}
