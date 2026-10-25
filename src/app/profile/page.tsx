'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/components/profile/Profile';

/**
 * Profile page: view your account information and sign out.
 * Protected by middleware (server) and this client component
 * (client-side navigations) so only authenticated users can reach it.
 */
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users arriving via client-side navigation.
  useEffect(() => {
    if (status === 'authenticated' && !session?.user) {
      router.replace('/');
    }
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, session, router]);

  // While session status is unknown, render nothing to avoid a flash.
  if (status === 'loading') {
    return null;
  }

  if (!session?.user) {
    return null;
  }

  return <Profile />;
}
