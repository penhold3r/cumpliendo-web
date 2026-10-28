export type InsightKind = 'time' | 'sessions' | 'records' | 'muscles' | null;

export interface HomeInsightSheetProps {
  kind: InsightKind;
  onDismiss: () => void;
}
