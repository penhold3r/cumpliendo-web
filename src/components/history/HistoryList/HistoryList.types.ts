export interface HistoryListProps {
  sessions: {
    id: string;
    routineName: string;
    startedAt: string;
    durationSeconds: number;
    totalVolumeKg: number;
    completedSets: number;
    totalSets: number;
    exercises: unknown[];
    routineId?: string;
  }[];
  onEditSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
}
