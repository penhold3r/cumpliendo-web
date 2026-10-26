import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { HistoryList } from './HistoryList';

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

const mockSessions = [
  {
    id: 'session-1',
    routineName: 'Torso - Fuerza & Hipertrofia',
    startedAt: '2024-01-15T10:00:00.000Z',
    durationSeconds: 3480,
    totalVolumeKg: 8420,
    completedSets: 18,
    totalSets: 18,
    exercises: [],
  },
  {
    id: 'session-2',
    routineName: 'Pierna Completa & Core',
    startedAt: '2024-01-12T10:00:00.000Z',
    durationSeconds: 3720,
    totalVolumeKg: 11200,
    completedSets: 17,
    totalSets: 17,
    exercises: [],
  },
];

describe('HistoryList', () => {
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

  it('renders all session cards', () => {
    render(<HistoryList sessions={mockSessions} />);

    expect(screen.getByText('Torso - Fuerza & Hipertrofia')).toBeInTheDocument();
    expect(screen.getByText('Pierna Completa & Core')).toBeInTheDocument();
  });

  it('renders empty state when no sessions', () => {
    render(<HistoryList sessions={[]} />);

    expect(screen.getByText(i18n.t('history.emptyTitle'))).toBeInTheDocument();
  });

  it('renders the title and subtitle', () => {
    render(<HistoryList sessions={mockSessions} />);

    expect(screen.getByText(i18n.t('history.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('history.subtitle'))).toBeInTheDocument();
  });
});
