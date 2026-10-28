'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { workoutActions } from '@/context/WorkoutContext/WorkoutContext.actions';
import {
  type Equipment,
  type Exercise,
  type MuscleGroup,
  type Routine,
  type RoutineExerciseTemplate,
} from '@/types';
import { toBlockMinutes } from '@/utils/sessionBlocks';
import {
  estimateRoutineMinutes,
  normalizeSupersets,
  toggleSupersetWithNext,
} from '@/utils/routineTargets';
import { exerciseName, routineText } from '@/i18n/labels';
import {
  type RoutineEditorProps,
  type RoutineExerciseItem,
} from './RoutineEditor.types';

const sameExercises = (a: RoutineExerciseItem[], b: RoutineExerciseItem[]) =>
  JSON.stringify(a.map(toTemplate)) === JSON.stringify(b.map(toTemplate));

const toTemplate = (e: RoutineExerciseItem): RoutineExerciseTemplate => ({
  exerciseId: e.exerciseId,
  defaultSets: e.defaultSets,
  defaultReps: e.defaultReps,
  defaultWeightKg: e.defaultWeightKg,
  equipment: e.equipment,
  category: e.category,
  ...(e.setsMax && e.setsMax > e.defaultSets ? { setsMax: e.setsMax } : {}),
  ...(!e.toFailure && e.repsMax && e.repsMax > e.defaultReps
    ? { repsMax: e.repsMax }
    : {}),
  ...(e.toFailure ? { toFailure: true } : {}),
  ...(e.perSide ? { perSide: true } : {}),
  ...(e.supersetId ? { supersetId: e.supersetId } : {}),
  ...(e.cue?.trim() ? { cue: e.cue.trim() } : {}),
});

export function useRoutineEditor({
  initialRoutine,
  draftExercises,
  onBack,
  onSuccess,
}: RoutineEditorProps) {
  const { state, dispatch } = useWorkout();
  const { exercises } = state;
  const isEditing = !!initialRoutine;

  const initialName = initialRoutine
    ? routineText(initialRoutine.id, 'name', initialRoutine.name)
    : '';
  const initialDescription = initialRoutine?.description
    ? routineText(initialRoutine.id, 'description', initialRoutine.description)
    : '';
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(
    initialRoutine?.category ?? 'strength',
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    initialRoutine?.estimatedMinutes ?? 45,
  );
  const [warmupMinutes, setWarmupMinutes] = useState(
    initialRoutine?.warmupMinutes ?? 0,
  );
  const [cooldownMinutes, setCooldownMinutes] = useState(
    initialRoutine?.cooldownMinutes ?? 0,
  );

  const [initialExercises] = useState<RoutineExerciseItem[]>(() => {
    const templates = initialRoutine?.exercises ?? draftExercises ?? [];
    return templates.map(t => {
      const found = exercises.find(e => e.id === t.exerciseId);
      return {
        exerciseId: t.exerciseId,
        name: exerciseName(t.exerciseId, found?.name ?? ''),
        equipment: t.equipment ?? found?.equipment ?? 'none',
        category: t.category ?? found?.category ?? 'full_body',
        defaultSets: t.defaultSets,
        defaultReps: t.defaultReps,
        defaultWeightKg: t.defaultWeightKg,
        setsMax: t.setsMax,
        repsMax: t.repsMax,
        toFailure: t.toFailure,
        perSide: t.perSide,
        supersetId: t.supersetId,
        cue: t.cue,
      };
    });
  });
  const [exercisesList, setExercisesList] =
    useState<RoutineExerciseItem[]>(initialExercises);

  const [addExerciseDialogOpen, setAddExerciseDialogOpen] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const isDirty =
    name !== initialName ||
    description !== initialDescription ||
    category !== (initialRoutine?.category ?? 'strength') ||
    estimatedMinutes !== (initialRoutine?.estimatedMinutes ?? 45) ||
    warmupMinutes !== (initialRoutine?.warmupMinutes ?? 0) ||
    cooldownMinutes !== (initialRoutine?.cooldownMinutes ?? 0) ||
    !sameExercises(exercisesList, initialRoutine ? initialExercises : []);

  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  const handleBack = useCallback(() => {
    if (isDirty) {
      setDiscardDialogOpen(true);
    } else {
      onBackRef.current();
    }
  }, [isDirty]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const handleAddExercise = (
    exercise: Exercise,
    equipment: Equipment,
    selectedCategory: MuscleGroup,
  ) => {
    setExercisesList(prev => [
      ...prev,
      {
        exerciseId: exercise.id,
        name: exerciseName(exercise.id, exercise.name),
        equipment,
        category: selectedCategory,
        defaultSets: 3,
        defaultReps: 10,
        defaultWeightKg: 0,
      },
    ]);
    setAddExerciseDialogOpen(false);
  };

  const handleUpdateExercise = (
    index: number,
    updates: Partial<RoutineExerciseItem>,
  ) => {
    setExercisesList(prev =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item)),
    );
  };

  const handleToggleSuperset = (index: number) => {
    setExercisesList(prev =>
      toggleSupersetWithNext(prev, index, () => `ss-${Date.now()}`),
    );
  };

  const handleRemoveExercise = (index: number) => {
    setExercisesList(prev =>
      normalizeSupersets(prev.filter((_, i) => i !== index)),
    );
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    setExercisesList(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      if (!moved) return prev;
      copy.splice(targetIndex, 0, moved);
      return normalizeSupersets(copy);
    });
  };

  const canSave = name.trim().length > 0;

  const suggestedMinutes =
    exercisesList.length > 0
      ? estimateRoutineMinutes(exercisesList.map(toTemplate), exercises)
      : null;

  const handleSave = () => {
    if (!canSave) return;

    const templates: RoutineExerciseTemplate[] = exercisesList.map(toTemplate);

    if (isEditing && initialRoutine) {
      const updated: Routine = {
        ...initialRoutine,
        name: name === initialName ? initialRoutine.name : name.trim(),
        description:
          description === initialDescription
            ? initialRoutine.description
            : description.trim(),
        category,
        estimatedMinutes,
        exercises: templates,
        warmupMinutes: toBlockMinutes(warmupMinutes),
        cooldownMinutes: toBlockMinutes(cooldownMinutes),
      };
      dispatch(workoutActions.updateRoutine(updated));
      onSuccess(updated);
    } else {
      const created: Routine = {
        id: `routine-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        category,
        estimatedMinutes,
        exercises: templates,
        warmupMinutes: toBlockMinutes(warmupMinutes),
        cooldownMinutes: toBlockMinutes(cooldownMinutes),
        createdAt: new Date().toISOString(),
      };
      dispatch(workoutActions.addRoutine(created));
      onSuccess(created);
    }
  };

  const handleDelete = () => {
    if (!initialRoutine) return;
    setDeleteConfirmOpen(false);
    dispatch(workoutActions.deleteRoutine(initialRoutine.id));
    onBackRef.current();
  };

  return {
    isEditing,
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    estimatedMinutes,
    setEstimatedMinutes,
    warmupMinutes,
    setWarmupMinutes,
    cooldownMinutes,
    setCooldownMinutes,
    exercisesList,
    addExerciseDialogOpen,
    setAddExerciseDialogOpen,
    discardDialogOpen,
    setDiscardDialogOpen,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    handleDelete,
    canSave,
    isDirty,
    handleBack,
    handleAddExercise,
    handleUpdateExercise,
    handleToggleSuperset,
    suggestedMinutes,
    handleRemoveExercise,
    handleMoveExercise,
    handleSave,
  };
}
