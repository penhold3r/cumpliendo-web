import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { ActiveWorkout } from './ActiveWorkout';

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

const mockActiveWorkout = {
  id: 'workout-1',
  routineName: 'Torso - Fuerza & Hipertrofia',
  startedAt: '2024-01-15T10:00:00.000Z',
  durationSeconds: 0,
  totalVolumeKg: 0,
  completedSets: 0,
  totalSets: 2,
  exercises: [
    {
      id: 'item-1',
      exerciseId: 'ex-pecho-1',
      exerciseName: 'Press de Banca Plano (Flat Bench Press)',
      category: 'chest',
      equipment: 'barbell',
      sets: [
        { id: 'set-1', setNumber: 1, weightKg: 60, reps: 10, completed: false },
      ],
    },
  ],
};

describe('ActiveWorkout', () => {
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

  it('renders the workout name', () => {
    render(<ActiveWorkout activeWorkout={mockActiveWorkout} workoutDuration={0} />);

    expect(screen.getByText('Torso - Fuerza & Hipertrofia')).toBeInTheDocument();
  });

  it('renders exercise names', () => {
    render(<ActiveWorkout activeWorkout={mockActiveWorkout} workoutDuration={0} />);

    expect(screen.getByText('Press de Banca Plano (Flat Bench Press)')).toBeInTheDocument();
  });

  it('renders finish workout button', () => {
    const { container } = render(<ActiveWorkout activeWorkout={mockActiveWorkout} workoutDuration={0} />);

    const buttons = container.querySelectorAll('lt-button');
    const finishButton = Array.from(buttons).find(b => b.textContent?.includes('Finish'));
    expect(finishButton).toBeDefined();
  });

  it('renders add exercise button', () => {
    const { container } = render(<ActiveWorkout activeWorkout={mockActiveWorkout} workoutDuration={0} />);

    const buttons = container.querySelectorAll('lt-button');
    const addButton = Array.from(buttons).find(b => b.textContent?.includes('Add'));
    expect(addButton).toBeDefined();
  });
});
