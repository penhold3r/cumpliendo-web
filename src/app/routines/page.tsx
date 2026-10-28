import { AuthenticatedShell } from '@/components/layout/AuthenticatedShell';
import { Routines } from '@/components/routines/Routines';

export const instant = false;

export default function RoutinesPage() {
  return (
    <AuthenticatedShell>
      <Routines />
    </AuthenticatedShell>
  );
}
