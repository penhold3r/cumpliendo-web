export interface AddToRoutineDialogProps {
  open: boolean;
  onClose: () => void;
  exerciseName: string;
  routines: {
    id: string;
    name: string;
  }[];
  onAddToRoutine?: (routineId: string, exerciseId: string) => void;
  onCreateRoutineWithExercise?: () => void;
}
