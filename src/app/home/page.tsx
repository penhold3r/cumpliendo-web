import { AuthenticatedShell } from '@/components/layout/AuthenticatedShell';
import { Home } from '@/components/home/Home';

export const instant = false;

export default function HomePage() {
  return (
    <AuthenticatedShell>
      <Home />
    </AuthenticatedShell>
  );
}
