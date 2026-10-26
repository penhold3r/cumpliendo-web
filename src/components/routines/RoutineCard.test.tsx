import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { useWorkout } from '@/context/WorkoutContext';
import { i18n } from '@/i18n';
import { RoutineCard } from './RoutineCard';

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

const mockRoutine = {
  id: 'routine-push-pull',
  name: 'Torso - Fuerza & Hipertrofia',
  description: 'Enfoque balanceado en pectoral, espalda y deltoides.',
  category: 'strength',
  estimatedMinutes: 55,
  exercises: [
    { exerciseId: 'ex-pecho-1', defaultSets: 4, defaultReps: 8, defaultWeightKg: 70 },
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('RoutineCard', () => {
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

  it('renders the routine name and description', () => {
    render(<RoutineCard routine={mockRoutine} onStartRoutine={vi.fn()} />);

    expect(screen.getByText('Upper Body - Strength & Hypertrophy')).toBeInTheDocument();
    expect(screen.getByText('Balanced focus on chest, back and delts.')).toBeInTheDocument();
  });

  it('renders the estimated time and exercise count', () => {
    render(<RoutineCard routine={mockRoutine} onStartRoutine={vi.fn()} />);

    expect(screen.getByText(/~55 min/)).toBeInTheDocument();
    expect(screen.getByText(/1 exercise/i)).toBeInTheDocument();
  });

  it('renders a start routine button', () => {
    const { container } = render(<RoutineCard routine={mockRoutine} onStartRoutine={vi.fn()} />);

    const buttons = container.querySelectorAll('lt-button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toContain(i18n.t('routineCard.start'));
  });

  it('calls onStartRoutine when start button is clicked', () => {
    const onStart = vi.fn();
    const { container } = render(<RoutineCard routine={mockRoutine} onStartRoutine={onStart} />);

    const button = container.querySelector('lt-button') as HTMLElement;
    button.click();

    expect(onStart).toHaveBeenCalledWith(mockRoutine);
  });
});
