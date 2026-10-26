import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { useWorkout } from '@/context/WorkoutContext';
import { i18n } from '@/i18n';
import { Home } from './Home';

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

vi.mock('@/context/WorkoutContext', () => ({
  useWorkout: vi.fn(() => ({
    state: {
      routines: [],
      history: [],
      isCloudSyncing: false,
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
    },
    dispatch: vi.fn(),
    refreshFromCloud: vi.fn(),
  })),
}));

describe('Home', () => {
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

  it('renders the home title and numbers section', () => {
    render(<Home />);

    expect(screen.getByText(i18n.t('home.numbers'))).toBeInTheDocument();
  });

  it('renders stat tiles for time and sessions', () => {
    render(<Home />);

    expect(screen.getByText(i18n.t('home.time30'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('home.sessions30'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('home.latestRecord'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('home.restedLongest'))).toBeInTheDocument();
  });

  it('renders empty state for last session when no history', () => {
    render(<Home />);

    expect(screen.getByText(i18n.t('home.noWorkouts'))).toBeInTheDocument();
  });

  it('renders empty state for routines when none exist', () => {
    render(<Home />);

    expect(screen.getByText(i18n.t('home.noRoutines'))).toBeInTheDocument();
  });

  it('renders nothing when not authenticated', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    const { container } = render(<Home />);

    expect(container.children).toHaveLength(0);
  });
});
