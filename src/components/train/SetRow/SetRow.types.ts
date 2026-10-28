export interface SetRowProps {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  onToggleComplete?: () => void;
  onWeightChange?: (value: number) => void;
  onRepsChange?: (value: number) => void;
}
