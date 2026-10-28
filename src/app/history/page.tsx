import { AuthenticatedShell } from '@/components/layout/AuthenticatedShell';
import { History } from '@/components/history/History';

export const instant = false;

export default function HistoryPage() {
  return (
    <AuthenticatedShell>
      <History />
    </AuthenticatedShell>
  );
}
