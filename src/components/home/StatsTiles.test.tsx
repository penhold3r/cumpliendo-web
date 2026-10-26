import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { StatsTiles } from './StatsTiles';

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

describe('StatsTiles', () => {
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

  it('renders all four stat tiles', () => {
    render(<StatsTiles time30={3600} sessions30={5} latestRecord="80 kg × 10" restedMuscle="Chest" />);

    expect(screen.getByText('Time · 30 days')).toBeInTheDocument();
    expect(screen.getByText('Sessions · 30 days')).toBeInTheDocument();
    expect(screen.getByText('Latest PR')).toBeInTheDocument();
    expect(screen.getByText('Rested Longest')).toBeInTheDocument();
  });

  it('renders the formatted time value', () => {
    render(<StatsTiles time30={3600} sessions30={5} latestRecord="None yet" restedMuscle="None yet" />);

    expect(screen.getByText('1h 0m')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
