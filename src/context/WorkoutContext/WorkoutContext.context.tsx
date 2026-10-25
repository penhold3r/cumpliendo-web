'use client';

import React, { createContext, useReducer, type ReactNode } from 'react';
import { workoutReducer } from './WorkoutContext.reducer';
import { initialWorkoutState } from './WorkoutContext.state';
import { useWorkoutEffects } from './useWorkoutEffects.hook';

type WorkoutContextValue = {
  state: typeof initialWorkoutState;
  dispatch: React.Dispatch<Parameters<typeof workoutReducer>[1]>;
  refreshFromCloud: () => Promise<boolean>;
};

export const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialWorkoutState);
  const { syncFromCloud } = useWorkoutEffects(state, dispatch, null);

  return (
    <WorkoutContext.Provider value={{ state, dispatch, refreshFromCloud: syncFromCloud }}>
      {children}
    </WorkoutContext.Provider>
  );
}
