import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { ExerciseFilters } from './ExerciseFilters';

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

describe('ExerciseFilters', () => {
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

  it('renders filter chips for muscle, equipment, and type', () => {
    render(<ExerciseFilters filters={{ types: [], muscles: [], equipment: [] }} onChange={vi.fn()} />);

    expect(screen.getByText('Muscle')).toBeInTheDocument();
    expect(screen.getByText('Equipment')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('renders clear button when filters are active', () => {
    render(<ExerciseFilters filters={{ types: ['strength'], muscles: [], equipment: [] }} onChange={vi.fn()} />);

    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('does not render clear button when no filters are active', () => {
    render(<ExerciseFilters filters={{ types: [], muscles: [], equipment: [] }} onChange={vi.fn()} />);

    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });
});
