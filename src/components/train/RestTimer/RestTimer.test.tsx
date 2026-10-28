import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { RestTimer } from './RestTimer';

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

describe('RestTimer', () => {
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

  it('renders the remaining time', () => {
    render(<RestTimer remainingSeconds={60} initialSeconds={90} />);

    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('renders the exercise name when provided', () => {
    render(<RestTimer remainingSeconds={30} initialSeconds={60} exerciseName="Press Banca" />);

    expect(screen.getByText('Rest · Press Banca')).toBeInTheDocument();
  });

  it('renders skip button', () => {
    const onSkip = vi.fn();
    render(<RestTimer remainingSeconds={30} initialSeconds={60} onSkip={onSkip} />);

    expect(screen.getByText('Skip')).toBeInTheDocument();
  });

  it('calls onSkip when skip is clicked', () => {
    const onSkip = vi.fn();
    const { container } = render(<RestTimer remainingSeconds={30} initialSeconds={60} onSkip={onSkip} />);

    const skipButton = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent?.trim() === 'Skip'
    ) as HTMLElement;
    skipButton.click();

    expect(onSkip).toHaveBeenCalled();
  });
});
