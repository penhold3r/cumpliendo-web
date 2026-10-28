'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWorkout } from '@/context/WorkoutContext';
import { AuthenticatedShell } from '@/components/layout/AuthenticatedShell';
import { RoutineEditor } from '@/components/routine-editor/RoutineEditor';

function RoutineEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useWorkout();

  const routineId = searchParams.get('routineId');
  const initialRoutine = routineId
    ? state.routines.find(r => r.id === routineId) ?? null
    : null;

  return (
    <RoutineEditor
      initialRoutine={initialRoutine}
      onBack={() => router.back()}
      onSuccess={() => router.back()}
    />
  );
}

export default function RoutineEditorPage() {
  return (
    <AuthenticatedShell>
      <Suspense>
        <RoutineEditorInner />
      </Suspense>
    </AuthenticatedShell>
  );
}
