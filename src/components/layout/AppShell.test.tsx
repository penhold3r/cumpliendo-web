import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from './AppShell';
import { useRouter } from 'next/navigation';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: true, isLoading: false, user: null })),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/home'),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

describe('AppShell', () => {
  it('renders the app header and main content area', () => {
    render(<AppShell />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders navigation tabs', () => {
    render(<AppShell />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('highlights the active tab based on current route', () => {
    render(<AppShell />);

    const homeTab = screen.getByRole('button', { name: /home/i });
    expect(homeTab).toHaveAttribute('aria-selected', 'true');
  });

  it('switches tabs when a tab is clicked', () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as any);

    render(<AppShell />);

    const routinesTab = screen.getByRole('button', { name: /routines/i });
    routinesTab.click();

    expect(mockPush).toHaveBeenCalledWith('/routines');
  });
});
