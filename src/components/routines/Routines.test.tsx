import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import { i18n } from '@/i18n';
import { Routines } from './Routines';

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

describe('Routines', () => {
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

  it('renders the routines title and subtitle', () => {
    render(<Routines />);

    expect(screen.getByText(i18n.t('routines.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('routines.subtitle'))).toBeInTheDocument();
  });

  it('renders each starter routine card with name and estimated time', () => {
    render(<Routines />);

    expect(screen.getByText('Torso - Fuerza & Hipertrofia')).toBeInTheDocument();
    expect(screen.getByText('Pierna Completa & Core')).toBeInTheDocument();
    expect(screen.getByText('Brazos & Hombros (Pump Day)')).toBeInTheDocument();
    expect(screen.getByText(/~55 min/)).toBeInTheDocument();
    expect(screen.getByText(/~60 min/)).toBeInTheDocument();
    expect(screen.getByText(/~45 min/)).toBeInTheDocument();
  });

  it('renders a start routine button for each routine', () => {
    const { container } = render(<Routines />);

    const buttons = container.querySelectorAll('lt-button');
    expect(buttons).toHaveLength(3);
  });

  it('renders nothing when not authenticated', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    const { container } = render(<Routines />);

    expect(container.children).toHaveLength(0);
  });
});
