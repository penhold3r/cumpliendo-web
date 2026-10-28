import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { AddToRoutineDialog } from './AddToRoutineDialog';

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

describe('AddToRoutineDialog', () => {
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

  it('renders nothing when closed', () => {
    const { container } = render(<AddToRoutineDialog open={false} onClose={vi.fn()} exerciseName="Squat" routines={[]} />);

    expect(container.children).toHaveLength(0);
  });

  it('renders the dialog when open', () => {
    render(<AddToRoutineDialog open={true} onClose={vi.fn()} exerciseName="Squat" routines={[]} />);

    expect(screen.getByText('Add to a Routine')).toBeInTheDocument();
  });

  it('shows the exercise name', () => {
    render(<AddToRoutineDialog open={true} onClose={vi.fn()} exerciseName="Squat" routines={[]} />);

    expect(screen.getByText('Squat')).toBeInTheDocument();
  });
});
