import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWorkoutEffects } from './useWorkoutEffects.hook';
import { initialWorkoutState } from './WorkoutContext.state';
import { type WorkoutState } from './WorkoutContext.state';

const mockDispatch = vi.fn();

describe('useWorkoutEffects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns syncFromCloud function', () => {
    const { result } = renderHook(
      () =>
        useWorkoutEffects(
          initialWorkoutState as WorkoutState,
          mockDispatch,
          null,
        ),
      {},
    );

    expect(typeof result.current.syncFromCloud).toBe('function');
  });

  it('syncFromCloud resolves false when no user', async () => {
    const { result } = renderHook(
      () =>
        useWorkoutEffects(
          initialWorkoutState as WorkoutState,
          mockDispatch,
          null,
        ),
      {},
    );

    const ok = await result.current.syncFromCloud();
    expect(ok).toBe(false);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'HYDRATE_CLOUD' }),
    );
  });
});
