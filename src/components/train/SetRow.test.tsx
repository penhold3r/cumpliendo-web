import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { SetRow } from './SetRow';

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

describe('SetRow', () => {
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

  it('renders set number, weight, and reps', () => {
    render(<SetRow setNumber={1} weightKg={80} reps={10} completed={false} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('80')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('renders completed state', () => {
    render(<SetRow setNumber={2} weightKg={70} reps={8} completed={true} />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onToggleComplete when complete button is clicked', () => {
    const onToggle = vi.fn();
    render(<SetRow setNumber={1} weightKg={80} reps={10} completed={false} onToggleComplete={onToggle} />);

    const button = screen.getByRole('button', { name: /complete/i });
    button.click();

    expect(onToggle).toHaveBeenCalled();
  });
});
