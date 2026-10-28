import { Suspense } from 'react';
import { AuthenticatedShell } from '@/components/layout/AuthenticatedShell';

export const instant = false;
import { LogPast } from '@/components/log-past/LogPast';

function LogPastInner() {
  return <LogPast />;
}

export default function LogPastPage() {
  return (
    <AuthenticatedShell>
      <Suspense>
        <LogPastInner />
      </Suspense>
    </AuthenticatedShell>
  );
}
