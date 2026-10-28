import type { Exercise, Equipment, MuscleGroup } from '@/types';

export interface AddExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise, equipment: Equipment, category: MuscleGroup) => void;
}
