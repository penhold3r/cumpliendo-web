import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { StreakBanner } from './StreakBanner';

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

describe('StreakBanner', () => {
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

  it('renders the streak ongoing message', () => {
    render(<StreakBanner currentStreak={4} bestStreak={12} />);

    expect(screen.getByText(i18n.t('streak.ongoing'))).toBeInTheDocument();
  });

  it('renders the current streak count', () => {
    render(<StreakBanner currentStreak={4} bestStreak={12} />);

    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders the best streak record', () => {
    render(<StreakBanner currentStreak={4} bestStreak={12} />);

    expect(screen.getByText(i18n.t('streak.best', { weeks: 12 }))).toBeInTheDocument();
  });
});
