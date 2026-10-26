import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { ExerciseLibrary } from './ExerciseLibrary';

vi.mock('@/context/WorkoutContext', () => ({
  useWorkout: vi.fn(() => ({
    state: {
      exercises: [
        { id: 'ex-piernas-1', name: 'Sentadilla (Squat)', category: 'legs', muscles: ['legs', 'glutes'], equipment: 'barbell', defaultRestSeconds: 150, workoutTypes: ['strength'] },
        { id: 'ex-pecho-1', name: 'Press de Banca Plano (Flat Bench Press)', category: 'chest', muscles: ['chest', 'arms', 'shoulders'], equipment: 'barbell', defaultRestSeconds: 120, workoutTypes: ['strength'] },
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

describe('ExerciseLibrary', () => {
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

  it('renders the exercises title and subtitle', () => {
    render(<ExerciseLibrary />);

    expect(screen.getByText(i18n.t('exercises.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('exercises.subtitle'))).toBeInTheDocument();
  });

  it('renders exercise cards with name and category', () => {
    render(<ExerciseLibrary />);

    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.getByText('Flat Bench Press')).toBeInTheDocument();
  });

  it('renders a search input', () => {
    render(<ExerciseLibrary />);

    expect(screen.getByPlaceholderText('Search by name...')).toBeInTheDocument();
  });

  it('renders filter chips', () => {
    render(<ExerciseLibrary />);

    expect(screen.getByText('Muscle')).toBeInTheDocument();
    expect(screen.getByText('Equipment')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });
});
