import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { SessionCard } from './SessionCard';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSession: vi.fn(() => ({
    data: { user: { id: 'usr_1', name: 'Ana', email: 'ana@example.com' }, expires: new Date().toISOString() },
    status: 'authenticated',
    update: vi.fn(),
  })),
}));

const mockSession = {
  id: 'session-1',
  routineName: 'Torso - Fuerza & Hipertrofia',
  startedAt: '2024-01-15T10:00:00.000Z',
  durationSeconds: 3480,
  totalVolumeKg: 8420,
  completedSets: 18,
  totalSets: 18,
  exercises: [],
};

describe('SessionCard', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'usr_1', name: 'Ana', email: 'ana@example.com' }, expires: new Date().toISOString() },
      status: 'authenticated',
      update: vi.fn(),
    });
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('renders the session name and date', () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText('Torso - Fuerza & Hipertrofia')).toBeInTheDocument();
    expect(screen.getByText(/58 min/)).toBeInTheDocument();
  });

  it('renders the volume', () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText(/8,420 kg/)).toBeInTheDocument();
  });

  it('renders the sets count', () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText(/18\/18/)).toBeInTheDocument();
  });
});
