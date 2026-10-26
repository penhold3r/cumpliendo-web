import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { useWorkout } from '@/context/WorkoutContext';
import { i18n } from '@/i18n';
import { RoutineList } from './RoutineList';

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

vi.mock('@/context/WorkoutContext', () => ({
  useWorkout: vi.fn(() => ({
    state: {
      exercises: [
        { id: 'ex-pecho-1', name: 'Press de Banca Plano (Flat Bench Press)', category: 'chest', equipment: 'barbell', defaultRestSeconds: 120 },
      ],
      routines: [],
      history: [],
      isCloudSyncing: false,
      stats: { totalWorkouts: 0, totalVolumeKg: 0, currentStreak: 0, bestStreak: 0, weeklyGoalDays: 0, completedThisWeek: 0, lastWorkoutDate: null, targetWeekdays: [] },
      activeWorkout: null,
      workoutDuration: 0,
      restTimer: { isActive: false, remainingSeconds: 0, initialSeconds: 0, endsAt: 0 },
    },
    dispatch: vi.fn(),
    refreshFromCloud: vi.fn(),
  })),
}));

const mockRoutines = [
  {
    id: 'routine-1',
    name: 'Routine 1',
    description: 'Desc 1',
    category: 'strength',
    estimatedMinutes: 30,
    exercises: [{ exerciseId: 'ex-pecho-1', defaultSets: 3, defaultReps: 10, defaultWeightKg: 0 }],
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'routine-2',
    name: 'Routine 2',
    description: 'Desc 2',
    category: 'hypertrophy',
    estimatedMinutes: 45,
    exercises: [{ exerciseId: 'ex-pecho-1', defaultSets: 4, defaultReps: 8, defaultWeightKg: 0 }],
    createdAt: '2024-01-02T00:00:00.000Z',
  },
];

describe('RoutineList', () => {
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

  it('renders all routine cards', () => {
    render(<RoutineList routines={mockRoutines} onStartRoutine={vi.fn()} />);

    expect(screen.getByText('Routine 1')).toBeInTheDocument();
    expect(screen.getByText('Routine 2')).toBeInTheDocument();
  });

  it('renders empty state when no routines', () => {
    render(<RoutineList routines={[]} onStartRoutine={vi.fn()} />);

    expect(screen.getByText(i18n.t('routines.emptyTitle'))).toBeInTheDocument();
  });

  it('renders a create button', () => {
    const { container } = render(<RoutineList routines={mockRoutines} onStartRoutine={vi.fn()} onCreateRoutine={vi.fn()} />);

    const buttons = container.querySelectorAll('lt-button');
    const createButton = Array.from(buttons).find(
      b => b.textContent?.toLowerCase().includes('new routine') || b.textContent?.toLowerCase().includes('nueva rutina')
    );
    expect(createButton).toBeDefined();
  });
});
