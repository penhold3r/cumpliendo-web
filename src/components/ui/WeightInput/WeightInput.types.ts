export interface WeightInputProps {
  weightKg: number;
  onChange: (kg: number) => void;
  weightPerSide?: boolean;
  onPerSideChange?: (value: boolean) => void;
  disabled?: boolean;
}
