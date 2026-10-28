import { AuthenticatedShell } from '@/components/layout/AuthenticatedShell';
import { Exercises } from '@/components/exercises/Exercises';

export const instant = false;

export default function ExercisesPage() {
  return (
    <AuthenticatedShell>
      <Exercises />
    </AuthenticatedShell>
  );
}
