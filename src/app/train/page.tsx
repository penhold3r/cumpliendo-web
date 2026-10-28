import { AuthenticatedShell } from '@/components/layout/AuthenticatedShell';
import { Train } from '@/components/train/Train';

export const instant = false;

export default function TrainPage() {
  return (
    <AuthenticatedShell>
      <Train />
    </AuthenticatedShell>
  );
}
