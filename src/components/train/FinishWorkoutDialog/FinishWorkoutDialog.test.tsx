import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { FinishWorkoutDialog } from './FinishWorkoutDialog';

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

describe('FinishWorkoutDialog', () => {
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

  it('renders the dialog when open', () => {
    render(<FinishWorkoutDialog open={true} onConfirm={vi.fn()} onDismiss={vi.fn()} />);

    expect(screen.getByText('Finish workout?')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<FinishWorkoutDialog open={false} onConfirm={vi.fn()} onDismiss={vi.fn()} />);

    expect(screen.queryByText('Finish workout?')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm is clicked', () => {
    const onConfirm = vi.fn();
    const { container } = render(<FinishWorkoutDialog open={true} onConfirm={onConfirm} onDismiss={vi.fn()} />);

    const buttons = container.querySelectorAll('button');
    const confirmButton = Array.from(buttons).find(b => b.textContent?.includes('Finish'));
    confirmButton?.click();

    expect(onConfirm).toHaveBeenCalled();
  });
});
