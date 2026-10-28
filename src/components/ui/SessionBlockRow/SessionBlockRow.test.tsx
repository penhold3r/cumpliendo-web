import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { i18n } from '@/i18n';
import { SessionBlockRow } from './SessionBlockRow';

function getStepperButtons(container: HTMLElement) {
  const buttons = container.querySelectorAll('lt-icon-button');
  return {
    decrease: buttons[0] as HTMLElement,
    increase: buttons[1] as HTMLElement,
  };
}

describe('SessionBlockRow', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders warmup label and hint', () => {
    render(<SessionBlockRow type="warmup" minutes={0} onChange={() => {}} />);
    expect(screen.getByText('Warm-up')).toBeDefined();
    expect(screen.getByText('At the start of the session')).toBeDefined();
  });

  it('renders cooldown label and hint', () => {
    render(<SessionBlockRow type="cooldown" minutes={0} onChange={() => {}} />);
    expect(screen.getByText('Cool-down')).toBeDefined();
    expect(screen.getByText('At the end of the session')).toBeDefined();
  });

  it('shows dash when minutes is 0', () => {
    render(<SessionBlockRow type="warmup" minutes={0} onChange={() => {}} />);
    expect(screen.getByText('—')).toBeDefined();
  });

  it('shows formatted minutes when active', () => {
    render(<SessionBlockRow type="warmup" minutes={10} onChange={() => {}} />);
    expect(screen.getByText('10 min')).toBeDefined();
  });

  it('calls onChange when stepper incremented', () => {
    const onChange = vi.fn();
    const { container } = render(
      <SessionBlockRow type="warmup" minutes={5} onChange={onChange} />,
    );
    const { increase } = getStepperButtons(container);
    fireEvent.click(increase);
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('calls onChange when stepper decremented', () => {
    const onChange = vi.fn();
    const { container } = render(
      <SessionBlockRow type="warmup" minutes={10} onChange={onChange} />,
    );
    const { decrease } = getStepperButtons(container);
    fireEvent.click(decrease);
    expect(onChange).toHaveBeenCalledWith(5);
  });
});
