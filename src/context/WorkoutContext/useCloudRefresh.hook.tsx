import { useCallback } from 'react';
import { useWorkout } from './useWorkout.hook';

/**
 * Provides pull-to-refresh sync and error display for the workout context.
 * On web, `refreshControl` is a simple callback; on mobile it maps to
 * React Native's RefreshControl component.
 */
export function useCloudRefresh() {
  const { refreshFromCloud } = useWorkout();

  const refreshFromCloudFn = useCallback(async (): Promise<boolean> => {
    return refreshFromCloud();
  }, [refreshFromCloud]);

  return {
    refreshControl: refreshFromCloudFn,
    syncErrorSnackbar: null,
  };
}
