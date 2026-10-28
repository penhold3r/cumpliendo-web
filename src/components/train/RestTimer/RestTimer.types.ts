export interface RestTimerProps {
  remainingSeconds: number;
  initialSeconds: number;
  exerciseName?: string;
  onSkip?: () => void;
  onAdjust?: (delta: number) => void;
}
