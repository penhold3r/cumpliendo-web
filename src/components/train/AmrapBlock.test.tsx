import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { AmrapBlock } from './AmrapBlock';

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

describe('AmrapBlock', () => {
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

  it('renders AMRAP title and time cap', () => {
    render(<AmrapBlock timeCapMinutes={8} rounds={5} />);

    expect(screen.getByText(/AMRAP/i)).toBeInTheDocument();
    expect(screen.getByText(/8 min/i)).toBeInTheDocument();
  });

  it('renders completed rounds', () => {
    render(<AmrapBlock timeCapMinutes={8} rounds={5} />);

    expect(screen.getByText(/5 completed rounds/i)).toBeInTheDocument();
  });
});
