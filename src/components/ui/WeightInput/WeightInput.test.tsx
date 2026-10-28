import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WeightInput } from './WeightInput';

vi.mock('@/context/SettingsContext/useUnits.hook', () => ({
  useUnits: () => ({
    units: 'metric',
    unitLabel: 'kg',
    formatWeight: (kg: number) => `${kg} kg`,
    toDisplay: (kg: number) => kg,
    fromDisplay: (v: number) => v,
  }),
}));

describe('WeightInput', () => {
  it('renders weight value and unit label', () => {
    render(<WeightInput weightKg={80} onChange={() => {}} />);
    const input = screen.getByLabelText('Weight (kg)') as HTMLInputElement;
    expect(input.value).toBe('80');
    expect(screen.getByText('kg')).toBeDefined();
  });

  it('calls onChange with kg value', () => {
    const onChange = vi.fn();
    render(<WeightInput weightKg={80} onChange={onChange} />);
    const input = screen.getByLabelText('Weight (kg)');
    fireEvent.change(input, { target: { value: '90' } });
    expect(onChange).toHaveBeenCalledWith(90);
  });

  it('sets to 0 when input is cleared', () => {
    const onChange = vi.fn();
    render(<WeightInput weightKg={80} onChange={onChange} />);
    const input = screen.getByLabelText('Weight (kg)');
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('shows per-side chip when onPerSideChange provided', () => {
    const onPerSideChange = vi.fn();
    render(
      <WeightInput
        weightKg={40}
        onChange={() => {}}
        weightPerSide={false}
        onPerSideChange={onPerSideChange}
      />,
    );
    const chip = screen.getByText('×2');
    expect(chip).toBeDefined();
    fireEvent.click(chip);
    expect(onPerSideChange).toHaveBeenCalledWith(true);
  });

  it('does not show per-side chip when onPerSideChange not provided', () => {
    render(<WeightInput weightKg={40} onChange={() => {}} />);
    expect(screen.queryByText('×2')).toBeNull();
  });

  it('disables input when disabled prop set', () => {
    render(<WeightInput weightKg={40} onChange={() => {}} disabled />);
    expect(screen.getByLabelText('Weight (kg)')).toHaveProperty(
      'disabled',
      true,
    );
  });
});
