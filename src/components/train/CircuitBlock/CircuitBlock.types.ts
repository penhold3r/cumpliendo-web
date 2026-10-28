export interface CircuitBlockProps {
  name: string;
  rounds: number;
  workSeconds: number;
  restSeconds: number;
  exercises?: { id: string; exerciseName: string }[];
}
