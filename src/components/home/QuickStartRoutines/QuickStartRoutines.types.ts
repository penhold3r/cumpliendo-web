export interface QuickStartRoutinesProps {
  routines: {
    id: string;
    name: string;
    description: string;
    category: string;
    estimatedMinutes: number;
    exercises: unknown[];
    createdAt: string;
  }[];
  onStart: (routine: QuickStartRoutinesProps['routines'][number]) => void;
  onExplore?: () => void;
}
