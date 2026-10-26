'use client';

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Home } from '@/components/home/Home';

/**
 * Post sign-in destination. Protected by middleware (server) and this client
 * component (client-side navigations) so only authenticated users can reach it.
 */
export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users arriving via client-side navigation.
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // While session status is unknown, render nothing to avoid a flash.
  if (status === "loading") {
    return null;
  }

  if (!session?.user) {
    return null;
  }

  return <Home />;
}
