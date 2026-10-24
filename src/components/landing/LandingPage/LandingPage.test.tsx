import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '@/i18n';
import { LandingPage } from './LandingPage';

const signIn = vi.fn();

vi.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => signIn(...args),
}));

describe('LandingPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    signIn.mockReset();
  });

  it('renders the brand, tagline and sign-in call to action', () => {
    const { container } = render(<LandingPage />);

    expect(screen.getByText('Cumpliendo')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('onboarding.tagline'))).toBeInTheDocument();

    const button = container.querySelector('lt-button');
    expect(button).not.toBeNull();
    expect(button?.textContent).toContain(i18n.t('onboarding.continueGoogle'));
  });

  it('renders every value proposition from the onboarding copy', () => {
    render(<LandingPage />);

    for (const slide of ['slide1', 'slide2', 'slide3']) {
      expect(
        screen.getByText(i18n.t(`onboarding.slides.${slide}.title`))
      ).toBeInTheDocument();
    }
  });

  it('starts the Google OAuth flow when the call to action is clicked', () => {
    const { container } = render(<LandingPage />);

    fireEvent.click(container.querySelector('lt-button') as HTMLElement);

    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/home' });
  });
});
