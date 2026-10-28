import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DurationPicker } from './DurationPicker';

function getStepperButtons(container: HTMLElement) {
  const buttons = container.querySelectorAll('lt-icon-button');
  return {
    decrease: buttons[0] as HTMLElement,
    increase: buttons[1] as HTMLElement,
  };
}

describe('DurationPicker', () => {
  it('renders default preset chips', () => {
    render(<DurationPicker value={30} onChange={() => {}} />);
    expect(screen.getAllByText('30 min').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('45 min')).toBeDefined();
    expect(screen.getByText('60 min')).toBeDefined();
  });

  it('renders custom presets', () => {
    render(
      <DurationPicker value={20} onChange={() => {}} presets={[20, 40]} />,
    );
    expect(screen.getAllByText('20 min').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('40 min')).toBeDefined();
    expect(screen.queryByText('45 min')).toBeNull();
  });

  it('calls onChange when a preset chip is clicked', () => {
    const onChange = vi.fn();
    render(<DurationPicker value={30} onChange={onChange} />);
    fireEvent.click(screen.getByText('45 min'));
    expect(onChange).toHaveBeenCalledWith(45);
  });

  it('calls onChange when stepper incremented', () => {
    const onChange = vi.fn();
    const { container } = render(
      <DurationPicker value={30} onChange={onChange} />,
    );
    const { increase } = getStepperButtons(container);
    fireEvent.click(increase);
    expect(onChange).toHaveBeenCalledWith(35);
  });

  it('calls onChange when stepper decremented', () => {
    const onChange = vi.fn();
    const { container } = render(
      <DurationPicker value={30} onChange={onChange} />,
    );
    const { decrease } = getStepperButtons(container);
    fireEvent.click(decrease);
    expect(onChange).toHaveBeenCalledWith(25);
  });

  it('does not go below min (5)', () => {
    const { container } = render(
      <DurationPicker value={5} onChange={() => {}} />,
    );
    const { decrease } = getStepperButtons(container);
    expect(decrease).toHaveProperty('disabled', true);
  });

  it('does not go above max (240)', () => {
    const { container } = render(
      <DurationPicker value={240} onChange={() => {}} />,
    );
    const { increase } = getStepperButtons(container);
    expect(increase).toHaveProperty('disabled', true);
  });
});
