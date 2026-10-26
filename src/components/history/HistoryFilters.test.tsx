import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { HistoryFilters } from './HistoryFilters';

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

describe('HistoryFilters', () => {
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

  it('renders filter options for workout type', () => {
    render(<HistoryFilters onChange={vi.fn()} />);

    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('renders a clear button when filters are active', () => {
    render(<HistoryFilters filters={{ types: ['strength'], dateFrom: '', dateTo: '' }} onChange={vi.fn()} />);

    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('does not render clear button when no filters active', () => {
    render(<HistoryFilters filters={{ types: [], dateFrom: '', dateTo: '' }} onChange={vi.fn()} />);

    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });
});
