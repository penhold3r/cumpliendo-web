import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { signOut, useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { Profile } from './Profile';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSession: vi.fn(() => ({ data: null, status: 'unauthenticated', update: vi.fn() })),
}));

vi.mock('@/context/SettingsContext/useSettings.hook', () => ({
  useSettings: () => ({
    units: 'metric' as const,
    themeMode: 'system' as const,
    language: 'es' as const,
    setUnits: vi.fn(),
    setThemeMode: vi.fn(),
    setLanguage: vi.fn(),
  }),
}));

vi.mock('@/context/WorkoutContext', () => ({
  useWorkout: () => ({
    state: {
      stats: {
        totalWorkouts: 42,
        currentStreak: 3,
        bestStreak: 12,
        totalVolumeKg: 15000,
        weeklyGoalDays: 4,
        completedThisWeek: 2,
        lastWorkoutDate: '2026-10-25',
      },
    },
  }),
}));

vi.mock('@/context/SettingsContext/useUnits.hook', () => ({
  useUnits: () => ({
    toDisplay: (kg: number) => kg,
    fromDisplay: (v: number) => v,
    unitLabel: 'kg',
  }),
}));

const mockUser = {
  id: 'usr_google_1234567890',
  name: 'Ana García',
  email: 'ana@example.com',
  image: 'https://example.com/avatar.jpg',
  createdAt: '2026-01-15T08:30:00.000Z',
  lastLoginAt: '2026-10-25T14:20:00.000Z',
};

const buttons = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('lt-button'));

const buttonByText = (container: HTMLElement, text: string) => {
  const button = buttons(container).find(
    el => el.textContent?.trim() === text,
  );
  if (!button) throw new Error(`No button "${text}"`);
  return button as HTMLElement;
};

describe('Profile', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('es');
    vi.mocked(useSession).mockReturnValue({
      data: { user: mockUser, expires: new Date().toISOString() },
      status: 'authenticated',
      update: vi.fn(),
    });
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('renders the profile title and user info', () => {
    render(<Profile />);

    expect(screen.getByText(i18n.t('profile.title'))).toBeInTheDocument();
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(
      screen.getAllByText('ana@example.com').length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('renders stats', () => {
    render(<Profile />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders membership dates', () => {
    render(<Profile />);

    expect(screen.getByText(i18n.t('profile.memberSince'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('profile.lastLogin'))).toBeInTheDocument();
  });

  it('shows a synced-to-cloud badge', () => {
    render(<Profile />);

    expect(screen.getByText(i18n.t('profile.synced'))).toBeInTheDocument();
  });

  it('renders preferences section', () => {
    render(<Profile />);

    expect(
      screen.getByText(i18n.t('profile.preferences')),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('profile.units'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('profile.theme'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('profile.language'))).toBeInTheDocument();
  });

  it('renders a sign out button', () => {
    const { container } = render(<Profile />);

    expect(buttonByText(container, i18n.t('profile.signOut'))).toBeDefined();
  });

  it('opens confirm dialog on sign-out click then signs out', () => {
    const { container } = render(<Profile />);

    fireEvent.click(buttonByText(container, i18n.t('profile.signOut')));
    expect(screen.getByText(i18n.t('profile.signOutTitle'))).toBeInTheDocument();

    const signOutButtons = buttons(container).filter(
      el => el.textContent?.trim() === i18n.t('profile.signOut'),
    );
    // The dialog's confirm button is the second one
    fireEvent.click(signOutButtons[signOutButtons.length - 1]);
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });

  it('renders nothing when not authenticated', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    const { container } = render(<Profile />);
    expect(container.children).toHaveLength(0);
  });
});
