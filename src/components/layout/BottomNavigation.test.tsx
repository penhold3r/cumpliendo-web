import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BottomNavigation } from './BottomNavigation';
import { useRouter } from 'next/navigation';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: true, isLoading: false, user: null })),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/home'),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

describe('BottomNavigation', () => {
  it('renders 5 navigation items', () => {
    render(<BottomNavigation />);

    const items = screen.getAllByRole('button');
    expect(items).toHaveLength(5);
  });

  it('marks the current route item as active', () => {
    render(<BottomNavigation />);

    const homeItem = screen.getByRole('button', { name: /home/i });
    expect(homeItem).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates when an item is clicked', () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    render(<BottomNavigation />);

    fireEvent.click(screen.getByRole('button', { name: /routines/i }));

    expect(mockPush).toHaveBeenCalledWith('/routines');
  });

  it('is accessible with proper ARIA labels', () => {
    render(<BottomNavigation />);

    const homeItem = screen.getByRole('button', { name: /home/i });
    expect(homeItem).toHaveAttribute('aria-label', expect.any(String));
  });
});
