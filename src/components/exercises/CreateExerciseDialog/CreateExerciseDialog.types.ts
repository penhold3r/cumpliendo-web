export interface CreateExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (exercise: { name: string; category: string; equipment: string; description?: string }) => void;
}
