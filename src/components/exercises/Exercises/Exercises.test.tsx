import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { Exercises } from './Exercises';

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

describe('Exercises', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('es');
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'usr_1', name: 'Ana', email: 'ana@example.com' }, expires: new Date().toISOString() },
      status: 'authenticated',
      update: vi.fn(),
    });
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('renders the exercises title and subtitle', () => {
    render(<Exercises />);

    expect(screen.getByText(i18n.t('exercises.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('exercises.subtitle'))).toBeInTheDocument();
  });

  it('renders exercise cards with name and category', () => {
    render(<Exercises />);

    expect(screen.getByText('Sentadilla (Squat)')).toBeInTheDocument();
    expect(screen.getByText('Press de Banca Plano (Flat Bench Press)')).toBeInTheDocument();
    expect(screen.getByText('Dominadas (Pull-ups)')).toBeInTheDocument();
  });

  it('renders nothing when not authenticated', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    const { container } = render(<Exercises />);

    expect(container.children).toHaveLength(0);
  });
});
