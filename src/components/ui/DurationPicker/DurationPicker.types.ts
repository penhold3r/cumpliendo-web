export interface DurationPickerProps {
  value: number;
  onChange: (minutes: number) => void;
  presets?: number[];
}
