import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { PullToRefresh } from './PullToRefresh';

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

describe('PullToRefresh', () => {
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

  it('renders children', () => {
    render(<PullToRefresh onRefresh={vi.fn()}><div>Content</div></PullToRefresh>);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders a refresh button', () => {
    render(<PullToRefresh onRefresh={vi.fn()}><div>Content</div></PullToRefresh>);

    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    render(<PullToRefresh onRefresh={onRefresh}><div>Content</div></PullToRefresh>);

    const button = screen.getByRole('button', { name: /refresh/i });
    button.click();

    expect(onRefresh).toHaveBeenCalled();
  });
});
