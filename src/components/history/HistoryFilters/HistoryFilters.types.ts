export interface HistoryFiltersProps {
  filters?: {
    types: string[];
    dateFrom: string;
    dateTo: string;
  };
  onChange: (filters: { types: string[]; dateFrom: string; dateTo: string }) => void;
}
