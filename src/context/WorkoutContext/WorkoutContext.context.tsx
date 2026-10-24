'use client';

import React, { createContext, useReducer, type ReactNode } from 'react';
import { workoutReducer } from './WorkoutContext.reducer';
import { initialWorkoutState } from './WorkoutContext.state';

export const WorkoutContext = createContext<any>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialWorkoutState);
  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
}
