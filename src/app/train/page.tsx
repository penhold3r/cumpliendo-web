'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Train } from '@/components/train/Train';

/**
 * Train page: live workout tracking.
 * Protected by middleware (server) and this client component
 * (client-side navigations) so only authenticated users can reach it.
 */
export default function TrainPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return null;
  }

  if (!session?.user) {
    return null;
  }

  return <Train />;
}
