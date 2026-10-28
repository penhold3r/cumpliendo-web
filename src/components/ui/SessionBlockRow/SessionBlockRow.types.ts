export interface SessionBlockRowProps {
  type: 'warmup' | 'cooldown';
  minutes: number;
  onChange: (minutes: number) => void;
}
