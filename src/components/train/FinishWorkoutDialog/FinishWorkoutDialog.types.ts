export interface FinishWorkoutDialogProps {
  open: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  unfinishedSets?: number;
}
