'use client';

import React, { createContext, useReducer, type ReactNode } from 'react';
import { workoutReducer } from './WorkoutContext.reducer';
import { initialWorkoutState } from './WorkoutContext.state';

type WorkoutContextValue = {
  state: typeof initialWorkoutState;
  dispatch: React.Dispatch<Parameters<typeof workoutReducer>[1]>;
};

export const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialWorkoutState);
  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
}
