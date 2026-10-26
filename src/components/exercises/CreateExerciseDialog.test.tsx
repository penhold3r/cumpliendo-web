import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { CreateExerciseDialog } from './CreateExerciseDialog';

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

describe('CreateExerciseDialog', () => {
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
    const { container } = render(<CreateExerciseDialog open={false} onClose={vi.fn()} />);

    expect(container.children).toHaveLength(0);
  });

  it('renders the dialog when open', () => {
    render(<CreateExerciseDialog open={true} onClose={vi.fn()} />);

    expect(screen.getByText('Create in Library')).toBeInTheDocument();
  });

  it('renders a name input field', () => {
    render(<CreateExerciseDialog open={true} onClose={vi.fn()} />);

    // Should have a name input
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });
});
