import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Stepper } from './Stepper';

function getButtons(container: HTMLElement) {
  const buttons = container.querySelectorAll('lt-icon-button');
  return {
    decrease: buttons[0] as HTMLElement,
    increase: buttons[1] as HTMLElement,
  };
}

describe('Stepper', () => {
  it('renders the formatted value', () => {
    render(
      <Stepper value={5} onChange={() => {}} format={v => `${v} min`} />,
    );
    expect(screen.getByText('5 min')).toBeDefined();
  });

  it('renders plain value when no format', () => {
    render(<Stepper value={10} onChange={() => {}} />);
    expect(screen.getByText('10')).toBeDefined();
  });

  it('calls onChange with incremented value on plus click', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Stepper value={5} onChange={onChange} step={5} />,
    );
    const { increase } = getButtons(container);
    fireEvent.click(increase);
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('calls onChange with decremented value on minus click', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Stepper value={10} onChange={onChange} step={5} />,
    );
    const { decrease } = getButtons(container);
    fireEvent.click(decrease);
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('disables minus button at min', () => {
    const { container } = render(
      <Stepper value={0} onChange={() => {}} min={0} />,
    );
    const { decrease } = getButtons(container);
    expect(decrease).toHaveProperty('disabled', true);
  });

  it('disables plus button at max', () => {
    const { container } = render(
      <Stepper value={10} onChange={() => {}} max={10} />,
    );
    const { increase } = getButtons(container);
    expect(increase).toHaveProperty('disabled', true);
  });

  it('does not go below min', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Stepper value={2} onChange={onChange} min={0} step={5} />,
    );
    const { decrease } = getButtons(container);
    fireEvent.click(decrease);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('does not go above max', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Stepper value={8} onChange={onChange} max={10} step={5} />,
    );
    const { increase } = getButtons(container);
    fireEvent.click(increase);
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('uses aria-label from label prop', () => {
    const { container } = render(
      <Stepper value={3} onChange={() => {}} label="sets" />,
    );
    const { decrease, increase } = getButtons(container);
    expect((decrease as HTMLElement).getAttribute('label')).toBe('Decrease sets');
    expect((increase as HTMLElement).getAttribute('label')).toBe('Increase sets');
  });
});
