import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { QuickStartRoutines } from './QuickStartRoutines';

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

const mockRoutines = [
  { id: 'r-1', name: 'Routine 1', description: 'Desc 1', category: 'strength', estimatedMinutes: 30, exercises: [], createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'r-2', name: 'Routine 2', description: 'Desc 2', category: 'hypertrophy', estimatedMinutes: 45, exercises: [], createdAt: '2024-01-02T00:00:00.000Z' },
];

describe('QuickStartRoutines', () => {
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

  it('renders routine cards', () => {
    render(<QuickStartRoutines routines={mockRoutines} onStart={vi.fn()} />);

    expect(screen.getByText('Routine 1')).toBeInTheDocument();
    expect(screen.getByText('Routine 2')).toBeInTheDocument();
  });

  it('renders empty state when no routines', () => {
    render(<QuickStartRoutines routines={[]} onStart={vi.fn()} />);

    expect(screen.getByText(i18n.t('home.noRoutines'))).toBeInTheDocument();
  });

  it('renders an explore button', () => {
    render(<QuickStartRoutines routines={mockRoutines} onStart={vi.fn()} onExplore={vi.fn()} />);

    expect(screen.getByText(i18n.t('home.explore'))).toBeInTheDocument();
  });
});
