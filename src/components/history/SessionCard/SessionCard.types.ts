export interface SessionCardProps {
  session: {
    id: string;
    routineName: string;
    startedAt: string;
    durationSeconds: number;
    totalVolumeKg: number;
    completedSets: number;
    totalSets: number;
    exercises: unknown[];
    routineId?: string;
  };
  onEdit?: (sessionId: string) => void;
  onDelete?: (sessionId: string) => void;
}
