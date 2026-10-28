import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TabPager } from './TabPager';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/home'),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

describe('TabPager', () => {
  it('renders children wrapped in a tab container', () => {
    render(
      <TabPager activeTab="tab-1">
        <div data-testid="tab-1">Tab 1 content</div>
        <div data-testid="tab-2">Tab 2 content</div>
      </TabPager>
    );

    expect(screen.getByTestId('tab-1')).toBeInTheDocument();
  });

  it('shows only the active tab by default', () => {
    render(
      <TabPager activeTab="tab-1">
        <div data-testid="tab-1">Tab 1 content</div>
        <div data-testid="tab-2">Tab 2 content</div>
      </TabPager>
    );

    expect(screen.getByTestId('tab-1')).toBeInTheDocument();
    expect(screen.queryByTestId('tab-2')).not.toBeInTheDocument();
  });

  it('switches to the active tab when prop changes', () => {
    const { rerender } = render(
      <TabPager activeTab="tab-1">
        <div data-testid="tab-1">Tab 1 content</div>
        <div data-testid="tab-2">Tab 2 content</div>
      </TabPager>
    );

    rerender(
      <TabPager activeTab="tab-2">
        <div data-testid="tab-1">Tab 1 content</div>
        <div data-testid="tab-2">Tab 2 content</div>
      </TabPager>
    );

    expect(screen.queryByTestId('tab-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('tab-2')).toBeInTheDocument();
  });
});
