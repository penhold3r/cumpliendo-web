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
    el => el.textContent?.trim() === text
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
    const { container } = render(<Profile />);

    expect(screen.getByText(i18n.t('profile.title'))).toBeInTheDocument();
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getAllByText('ana@example.com').length).toBeGreaterThanOrEqual(2);
    expect(container.children).toHaveLength(1);
  });

  it('renders the user ID and membership dates', () => {
    render(<Profile />);

    expect(screen.getByText('usr_google_1234567890')).toBeInTheDocument();
    expect(screen.getByText(/miembro desde/i)).toBeInTheDocument();
    expect(screen.getByText(/último acceso/i)).toBeInTheDocument();
  });

  it('shows a synced-to-cloud badge', () => {
    render(<Profile />);

    expect(screen.getByText(i18n.t('profile.synced'))).toBeInTheDocument();
  });

  it('renders a sign out button', () => {
    const { container } = render(<Profile />);

    expect(buttonByText(container, i18n.t('profile.signOut'))).toBeDefined();
  });

  it('calls signOut when the sign out button is clicked', () => {
    const { container } = render(<Profile />);

    fireEvent.click(buttonByText(container, i18n.t('profile.signOut')));

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
