import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { History } from './History';

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

describe('History', () => {
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

  it('renders the history title and subtitle', () => {
    render(<History />);

    expect(screen.getByText(i18n.t('history.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('history.subtitle'))).toBeInTheDocument();
  });

  it('renders empty state when no workouts', () => {
    render(<History />);

    expect(screen.getByText(i18n.t('history.emptyTitle'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('history.emptyBody'))).toBeInTheDocument();
  });

  it('renders a start live workout button', () => {
    const { container } = render(<History />);

    const buttons = container.querySelectorAll('lt-button');
    expect(buttons).toHaveLength(2);

    const startButton = Array.from(buttons).find(
      b => b.textContent?.includes(i18n.t('history.startLive'))
    );
    expect(startButton).toBeDefined();

    const logPastButton = Array.from(buttons).find(
      b => b.textContent?.includes(i18n.t('history.logPast'))
    );
    expect(logPastButton).toBeDefined();
  });

  it('renders nothing when not authenticated', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    const { container } = render(<History />);

    expect(container.children).toHaveLength(0);
  });
});
