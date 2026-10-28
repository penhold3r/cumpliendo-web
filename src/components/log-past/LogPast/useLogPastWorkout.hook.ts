'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { workoutActions } from '@/context/WorkoutContext/WorkoutContext.actions';
import { buildPastWorkoutSession } from '@/context/WorkoutContext/WorkoutContext.utils';
import {
  type WorkoutType,
  type WodFormat,
  type CircuitBlockType,
  type WorkoutCircuit,
  type PastWorkoutExerciseItem,
  type Exercise,
  type Equipment,
  type MuscleGroup,
  type WorkoutSession,
} from '@/types';
import { calculateMetrics, type LogPastMetrics } from './LogPast.utils';
import { blockMinutesTotal } from '@/utils/sessionBlocks';
import { isBodyweight } from '@/utils/workoutUtils';
import { DEFAULT_AMRAP_MINUTES, isAmrap } from '@/utils/circuitTiming';

export interface UseLogPastWorkoutParams {
  initialSession?: WorkoutSession | null;
  onBack: () => void;
  onSuccess?: () => void;
}

export function useLogPastWorkout({
  initialSession,
  onBack,
  onSuccess,
}: UseLogPastWorkoutParams) {
  const { dispatch } = useWorkout();
  const isEditing = !!initialSession;

  // 1. Date State
  const initialDate = initialSession?.startedAt
    ? new Date(initialSession.startedAt)
    : new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarViewYear, setCalendarViewYear] = useState(
    initialDate.getFullYear(),
  );
  const [calendarViewMonth, setCalendarViewMonth] = useState(
    initialDate.getMonth(),
  );

  // 2. Workout Type & Format
  const [workoutType, setWorkoutType] = useState<WorkoutType>(
    initialSession?.workoutType || 'functional',
  );
  const [wodFormat, setWodFormat] = useState<WodFormat>(
    initialSession?.wodFormat || 'circuit',
  );

  // 3. Structure Mode
  const isCircuitByDefault =
    ['circuit', 'tabata', 'emom', 'rounds'].includes(wodFormat) ||
    ['functional', 'hiit', 'crossfit', 'class'].includes(workoutType);

  const [structureMode, setStructureMode] = useState<'circuit' | 'simple'>(
    initialSession?.circuits && initialSession.circuits.length > 0
      ? 'circuit'
      : isCircuitByDefault
        ? 'circuit'
        : 'simple',
  );

  // 4. Flat Exercise List
  const defaultInitialFlatExercises: PastWorkoutExerciseItem[] =
    initialSession &&
    (!initialSession.circuits || initialSession.circuits.length === 0)
      ? initialSession.exercises.map(ex => {
          const firstSet = ex.sets?.[0];
          const measuredAmount = firstSet?.distanceMeters ?? firstSet?.calories;
          const hasDetail =
            firstSet?.repsDetail !== undefined &&
            firstSet?.repsDetail !== null &&
            firstSet?.repsDetail !== 'null' &&
            firstSet?.repsDetail !== '';
          const initialDetail = hasDetail
            ? String(firstSet.repsDetail)
            : firstSet?.reps !== undefined &&
                firstSet.reps !== null &&
                !isNaN(firstSet.reps)
              ? String(firstSet.reps)
              : ex.notes?.replace('Detalle: ', '') || '';
          return {
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            category: ex.category,
            equipment: ex.equipment,
            weightKg: firstSet?.weightKg,
            weightPerSide: firstSet?.weightPerSide,
            measure: ex.measure,
            repsIncrement: ex.repsIncrement,
            reps: measuredAmount ?? firstSet?.reps,
            repsDetail:
              measuredAmount !== undefined && !hasDetail
                ? String(measuredAmount)
                : initialDetail,
            timeString: firstSet?.timeString || '30s',
            workSeconds: firstSet?.workSeconds || 30,
            restSeconds: firstSet?.restSeconds ?? 10,
            rounds: ex.sets?.length || 3,
          };
        })
      : [];

  // 5. Circuits State
  const defaultInitialCircuits: WorkoutCircuit[] =
    initialSession?.circuits && initialSession.circuits.length > 0
      ? initialSession.circuits.map(c => ({
          ...c,
          exercises: c.exercises.map(ex => {
            const hasDetail =
              ex.repsDetail !== undefined &&
              ex.repsDetail !== null &&
              ex.repsDetail !== 'null' &&
              ex.repsDetail !== '';
            const initialDetail = hasDetail
              ? String(ex.repsDetail)
              : ex.reps !== undefined && ex.reps !== null && !isNaN(ex.reps)
                ? String(ex.reps)
                : '';
            return {
              ...ex,
              repsDetail: initialDetail,
              timeString:
                ex.timeString && ex.timeString !== 'null'
                  ? ex.timeString
                  : ex.workSeconds
                    ? `${ex.workSeconds}s`
                    : isAmrap(c)
                      ? ''
                      : `${c.workSeconds || 30}s`,
            };
          }),
        }))
      : [
          {
            id: 'c-1',
            name: 'Circuito 1',
            rounds: 3,
            workSeconds: 30,
            restSeconds: 10,
            restBetweenCircuitsSeconds: 60,
            exercises: defaultInitialFlatExercises,
          },
        ];

  const [circuits, setCircuits] = useState<WorkoutCircuit[]>(
    defaultInitialCircuits,
  );
  const [exerciseItems, setExerciseItems] = useState<PastWorkoutExerciseItem[]>(
    defaultInitialFlatExercises,
  );

  const [addExerciseTarget, setAddExerciseTarget] = useState<{
    targetCircuitId?: string;
  } | null>(null);

  const [warmupMinutes, setWarmupMinutes] = useState(
    initialSession?.warmupMinutes ?? 0,
  );
  const [cooldownMinutes, setCooldownMinutes] = useState(
    initialSession?.cooldownMinutes ?? 0,
  );

  const initialDurationMinutes = initialSession
    ? Math.max(
        1,
        Math.round(initialSession.durationSeconds / 60) -
          blockMinutesTotal(initialSession),
      )
    : 45;

  const [durationMinutes, setDurationMinutes] = useState(
    Math.max(1, initialDurationMinutes),
  );

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  // Unsaved changes detection
  const snapshot = JSON.stringify({
    day: selectedDate.toDateString(),
    workoutType,
    wodFormat,
    structureMode,
    circuits,
    exerciseItems,
    warmupMinutes,
    cooldownMinutes,
    durationMinutes,
  });
  const initialSnapshotRef = useRef(snapshot);
  const isDirty = snapshot !== initialSnapshotRef.current;

  const handleBack = useCallback(() => {
    if (isDirty) {
      setDiscardDialogOpen(true);
    } else {
      onBack();
    }
  }, [isDirty, onBack]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const metrics: LogPastMetrics = calculateMetrics(
    circuits,
    exerciseItems,
    structureMode,
  );

  const effectiveDurationMinutes = durationMinutes;
  const totalDurationMinutes =
    effectiveDurationMinutes + warmupMinutes + cooldownMinutes;

  const handleSelectQuickDate = (mode: 'today' | 'yesterday') => {
    if (mode === 'today') {
      setSelectedDate(new Date());
    } else {
      const yest = new Date();
      yest.setDate(yest.getDate() - 1);
      setSelectedDate(yest);
    }
  };

  const openCalendar = () => {
    setCalendarViewYear(selectedDate.getFullYear());
    setCalendarViewMonth(selectedDate.getMonth());
    setCalendarOpen(true);
  };

  const handlePrevMonth = () => {
    if (calendarViewMonth === 0) {
      setCalendarViewMonth(11);
      setCalendarViewYear(y => y - 1);
    } else {
      setCalendarViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarViewMonth === 11) {
      setCalendarViewMonth(0);
      setCalendarViewYear(y => y + 1);
    } else {
      setCalendarViewMonth(m => m + 1);
    }
  };

  const handlePickCalendarDay = (day: number) => {
    const newDate = new Date(calendarViewYear, calendarViewMonth, day, 12, 0, 0);
    setSelectedDate(newDate);
    setCalendarOpen(false);
  };

  const handleAddExerciseFromModal = (
    ex: Exercise,
    equipmentOverride: Equipment,
    categoryOverride: MuscleGroup,
  ) => {
    const defaultWorkSec = 30;
    const newItem: PastWorkoutExerciseItem = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      category: categoryOverride,
      equipment: equipmentOverride,
      weightKg: isBodyweight(equipmentOverride) ? 0 : undefined,
      reps: undefined,
      repsDetail: '',
      timeString: '30s',
      workSeconds: defaultWorkSec,
      restSeconds: 10,
      rounds: 3,
    };

    if (structureMode === 'circuit' && addExerciseTarget?.targetCircuitId) {
      setCircuits(prev =>
        prev.map(c => {
          if (c.id === addExerciseTarget.targetCircuitId) {
            const timing = isAmrap(c)
              ? {
                  workSeconds: undefined,
                  timeString: '',
                  restSeconds: undefined,
                }
              : {
                  workSeconds: c.workSeconds,
                  timeString: `${c.workSeconds}s`,
                  restSeconds: c.restSeconds,
                };
            return {
              ...c,
              exercises: [...c.exercises, { ...newItem, ...timing }],
            };
          }
          return c;
        }),
      );
    } else {
      setExerciseItems(prev => [...prev, newItem]);
    }
    setAddExerciseTarget(null);
  };

  const handleAddCircuit = () => {
    const newCircuitNumber = circuits.length + 1;
    const previous = circuits[circuits.length - 1];
    const newCircuit: WorkoutCircuit = {
      id: `c-${Date.now()}-${newCircuitNumber}`,
      name: `Circuito ${newCircuitNumber}`,
      blockType: previous?.blockType,
      timeCapMinutes: previous?.timeCapMinutes,
      rounds: 3,
      workSeconds: 30,
      restSeconds: 10,
      restBetweenCircuitsSeconds: 60,
      exercises: [],
    };
    setCircuits(prev => [...prev, newCircuit]);
  };

  const handleSetCircuitBlockType = (
    circuitId: string,
    blockType: CircuitBlockType,
  ) => {
    setCircuits(prev =>
      prev.map(c => {
        if (c.id !== circuitId || (c.blockType ?? 'intervals') === blockType) {
          return c;
        }
        const inherited = `${c.workSeconds}s`;
        return {
          ...c,
          blockType,
          timeCapMinutes: c.timeCapMinutes ?? DEFAULT_AMRAP_MINUTES,
          exercises: c.exercises.map(e => {
            if (blockType === 'amrap') {
              return e.timeString === inherited || !e.timeString
                ? {
                    ...e,
                    timeString: '',
                    workSeconds: undefined,
                    restSeconds: undefined,
                  }
                : { ...e, restSeconds: undefined };
            }
            return e.timeString
              ? { ...e, restSeconds: c.restSeconds }
              : {
                  ...e,
                  timeString: inherited,
                  workSeconds: c.workSeconds,
                  restSeconds: c.restSeconds,
                };
          }),
        };
      }),
    );
  };

  const handleRemoveCircuit = (circuitId: string) => {
    if (circuits.length <= 1) return;
    setCircuits(prev => prev.filter(c => c.id !== circuitId));
  };

  const handleUpdateCircuitField = (
    circuitId: string,
    field: keyof WorkoutCircuit,
    val: WorkoutCircuit[keyof WorkoutCircuit],
  ) => {
    setCircuits(prev =>
      prev.map(c => {
        if (c.id === circuitId) {
          const updated = { ...c, [field]: val };
          if (field === 'workSeconds' && typeof val === 'number') {
            updated.exercises = updated.exercises.map(e => ({
              ...e,
              workSeconds: val,
              timeString: `${val}s`,
            }));
          }
          if (field === 'restSeconds' && typeof val === 'number') {
            updated.exercises = updated.exercises.map(e => ({
              ...e,
              restSeconds: val,
            }));
          }
          return updated;
        }
        return c;
      }),
    );
  };

  const handleUpdateCircuitExerciseValues = (
    circuitId: string,
    exIndex: number,
    updates: Partial<PastWorkoutExerciseItem>,
  ) => {
    setCircuits(prev =>
      prev.map(c => {
        if (c.id === circuitId) {
          const exercises = [...c.exercises];
          const current = exercises[exIndex];
          if (!current) return c;
          exercises[exIndex] = { ...current, ...updates };
          return { ...c, exercises };
        }
        return c;
      }),
    );
  };

  const handleRemoveCircuitExercise = (circuitId: string, exIndex: number) => {
    setCircuits(prev =>
      prev.map(c => {
        if (c.id === circuitId) {
          return {
            ...c,
            exercises: c.exercises.filter((_, i) => i !== exIndex),
          };
        }
        return c;
      }),
    );
  };

  const handleUpdateFlatExerciseValues = (
    exIndex: number,
    updates: Partial<PastWorkoutExerciseItem>,
  ) => {
    setExerciseItems(prev => {
      const copy = [...prev];
      const current = copy[exIndex];
      if (!current) return prev;
      copy[exIndex] = { ...current, ...updates };
      return copy;
    });
  };

  const handleRemoveFlatExercise = (exIndex: number) => {
    setExerciseItems(prev => prev.filter((_, i) => i !== exIndex));
  };

  const handleSave = () => {
    const { newSession, workoutDate } = buildPastWorkoutSession({
      editSessionId: initialSession?.id,
      workoutType,
      wodFormat,
      durationMinutes: effectiveDurationMinutes,
      date: selectedDate.toISOString(),
      circuits: structureMode === 'circuit' ? circuits : undefined,
      customExercises: structureMode === 'simple' ? exerciseItems : undefined,
      warmupMinutes,
      cooldownMinutes,
      notes: initialSession?.notes,
    });
    dispatch(workoutActions.logPastWorkout(newSession, isEditing, workoutDate));

    if (onSuccess) {
      onSuccess();
    } else {
      onBack();
    }
  };

  const handleDeleteSession = () => {
    if (initialSession) {
      dispatch(workoutActions.deleteSession(initialSession.id));
      setDeleteConfirmOpen(false);
      onBack();
    }
  };

  const daysInMonth = new Date(
    calendarViewYear,
    calendarViewMonth + 1,
    0,
  ).getDate();
  const firstDayIndex =
    (new Date(calendarViewYear, calendarViewMonth, 1).getDay() + 6) % 7;

  return {
    isEditing,
    selectedDate,
    calendarOpen,
    setCalendarOpen,
    calendarViewYear,
    calendarViewMonth,
    workoutType,
    setWorkoutType,
    wodFormat,
    setWodFormat,
    structureMode,
    setStructureMode,
    circuits,
    exerciseItems,
    addExerciseTarget,
    setAddExerciseTarget,
    durationMinutes,
    setDurationMinutes,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    discardDialogOpen,
    setDiscardDialogOpen,
    isDirty,
    handleBack,
    metrics,
    effectiveDurationMinutes,
    totalDurationMinutes,
    warmupMinutes,
    setWarmupMinutes,
    cooldownMinutes,
    setCooldownMinutes,
    handleSelectQuickDate,
    openCalendar,
    handlePrevMonth,
    handleNextMonth,
    handlePickCalendarDay,
    handleAddExerciseFromModal,
    handleAddCircuit,
    handleRemoveCircuit,
    handleSetCircuitBlockType,
    handleUpdateCircuitField,
    handleUpdateCircuitExerciseValues,
    handleRemoveCircuitExercise,
    handleUpdateFlatExerciseValues,
    handleRemoveFlatExercise,
    handleSave,
    handleDeleteSession,
    daysInMonth,
    firstDayIndex,
  };
}
