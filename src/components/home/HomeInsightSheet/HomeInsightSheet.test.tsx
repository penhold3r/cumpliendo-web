import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { HomeInsightSheet } from './HomeInsightSheet';

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

describe('HomeInsightSheet', () => {
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

  it('renders nothing when kind is null', () => {
    const { container } = render(<HomeInsightSheet kind={null} onDismiss={vi.fn()} />);

    expect(container.children).toHaveLength(0);
  });

  it('renders the insight sheet when kind is provided', () => {
    render(<HomeInsightSheet kind="time" onDismiss={vi.fn()} />);

    expect(screen.getByText(i18n.t('insights.open'))).toBeInTheDocument();
  });

  it('calls onDismiss when close is clicked', () => {
    const onDismiss = vi.fn();
    const { container } = render(<HomeInsightSheet kind="time" onDismiss={onDismiss} />);

    const buttons = container.querySelectorAll('button');
    const closeButton = Array.from(buttons).find(b => b.textContent?.includes('Close') || b.textContent?.includes('Cerrar'));
    closeButton?.click();

    expect(onDismiss).toHaveBeenCalled();
  });
});
