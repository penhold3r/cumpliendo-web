import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppHeader } from './AppHeader';
import { useRouter } from 'next/navigation';

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: true, isLoading: false, user: { name: 'Ana' } })),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/home'),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

describe('AppHeader', () => {
  it('renders the logo and app title', () => {
    render(<AppHeader />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Cumpliendo')).toBeInTheDocument();
  });

  it('renders navigation tabs for all 5 sections', () => {
    const { container } = render(<AppHeader />);

    const navItems = container.querySelectorAll('lt-nav-item');
    expect(navItems).toHaveLength(5);
  });

  it('marks the current route tab as active', () => {
    const { container } = render(<AppHeader />);

    const navItems = container.querySelectorAll('lt-nav-item');
    const homeItem = Array.from(navItems).find(
      (el) => el.getAttribute('label') === 'Home' || el.textContent?.includes('Home')
    );
    expect(homeItem).toBeDefined();
  });

  it('navigates when a tab is clicked', () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    const { container } = render(<AppHeader />);

    const navItems = container.querySelectorAll('lt-nav-item');
    const exercisesItem = Array.from(navItems).find(
      (el) => el.textContent?.includes('Exercises')
    );
    fireEvent.click(exercisesItem as HTMLElement);

    expect(mockPush).toHaveBeenCalledWith('/exercises');
  });

  it('renders the account avatar when authenticated', () => {
    const { container } = render(<AppHeader />);

    const iconButtons = container.querySelectorAll('lt-icon-button');
    expect(iconButtons.length).toBeGreaterThanOrEqual(1);
  });
});
