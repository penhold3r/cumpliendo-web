import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { Train } from './Train';

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
      activeWorkout: null,
      restTimer: { isActive: false, remainingSeconds: 0, initialSeconds: 0, endsAt: 0 },
      isCloudSyncing: false,
      routines: [],
      history: [],
      exercises: [],
      stats: {
        currentStreak: 0,
        bestStreak: 0,
        weeklyGoalDays: 4,
        completedThisWeek: 0,
        totalWorkouts: 0,
        totalVolumeKg: 0,
        lastWorkoutDate: null,
        targetWeekdays: [],
      },
      workoutDuration: 0,
    },
    dispatch: vi.fn(),
    refreshFromCloud: vi.fn(),
  })),
}));

vi.mock('@/context/SettingsContext', () => ({
  useSettings: vi.fn(() => ({
    units: 'metric',
    themeMode: 'system',
    language: 'es',
    setUnits: vi.fn(),
    setThemeMode: vi.fn(),
    setLanguage: vi.fn(),
  })),
  useUnits: vi.fn(() => ({
    units: 'metric',
    unitLabel: 'kg',
    formatWeight: (kg: number) => `${kg} kg`,
    toDisplay: (kg: number) => kg,
    fromDisplay: (value: number) => value,
  })),
}));

describe('Train', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('es');
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'usr_1', name: 'Ana', email: 'ana@example.com' }, expires: new Date().toISOString() },
      status: 'authenticated',
      update: vi.fn(),
    });
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('renders the train title and subtitle when no active workout', () => {
    render(<Train />);

    expect(screen.getByText(i18n.t('train.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('train.subtitle'))).toBeInTheDocument();
  });

  it('renders three action cards when no active workout', () => {
    render(<Train />);

    expect(screen.getByText(i18n.t('common.freeWorkout'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('train.fromRoutines'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('train.logClass'))).toBeInTheDocument();
  });

  it('renders nothing when not authenticated', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    const { container } = render(<Train />);

    expect(container.children).toHaveLength(0);
  });
});
