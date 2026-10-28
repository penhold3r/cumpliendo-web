import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { CircuitBlock } from './CircuitBlock';

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

describe('CircuitBlock', () => {
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

  it('renders circuit name and rounds', () => {
    render(<CircuitBlock name="Circuit 1" rounds={3} workSeconds={30} restSeconds={10} />);

    expect(screen.getByText('Circuit 1')).toBeInTheDocument();
    expect(screen.getByText(/3 rounds/i)).toBeInTheDocument();
  });

  it('renders work and rest times', () => {
    render(<CircuitBlock name="Circuit 1" rounds={3} workSeconds={30} restSeconds={10} />);

    expect(screen.getByText(/30s work/i)).toBeInTheDocument();
    expect(screen.getByText(/10s rest/i)).toBeInTheDocument();
  });
});
