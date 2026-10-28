'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { HeaderNav } from '../HeaderNav';
import { BottomNavigation } from '../BottomNavigation';
import styles from './AuthenticatedShell.module.css';

interface AuthenticatedShellProps {
  children: React.ReactNode;
}

export function AuthenticatedShell({ children }: AuthenticatedShellProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return null;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const isOverlay = pathname.startsWith('/routine-editor') || pathname.startsWith('/log-past');

  return (
    <div className={styles.shell}>
      {!isOverlay && <HeaderNav className={styles.headerNav} />}
      <main className={styles.main}>{children}</main>
      {!isOverlay && <BottomNavigation className={styles.mobileNav} />}
    </div>
  );
}
