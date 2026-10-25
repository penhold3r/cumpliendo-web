'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Routines } from '@/components/routines/Routines';

/**
 * Routines page: list starter routines and start a workout from one.
 * Protected by middleware (server) and this client component
 * (client-side navigations) so only authenticated users can reach it.
 */
export default function RoutinesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users arriving via client-side navigation.
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  // While session status is unknown, render nothing to avoid a flash.
  if (status === 'loading') {
    return null;
  }

  if (!session?.user) {
    return null;
  }

  return <Routines />;
}
