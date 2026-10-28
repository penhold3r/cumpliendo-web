'use client';

import { IconButton, Text, type IconButtonProps } from '@latty-ds/react';
import styles from './Stepper.module.css';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
  label?: string;
  size?: 'sm' | 'md';
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  format,
  label,
  size = 'md',
}: StepperProps) {
  const atMin = value <= min;
  const atMax = value >= max;

  const decrement = () => {
    if (!atMin) onChange(Math.max(min, value - step));
  };

  const increment = () => {
    if (!atMax) onChange(Math.min(max, value + step));
  };

  const displayValue = format ? format(value) : String(value);

  return (
    <div
      className={`${styles.stepper} ${size === 'sm' ? styles.sm : ''}`}
      role="group"
      aria-label={label}
    >
      <IconButton
        icon={'remove' as IconButtonProps['icon']}
        size="sm"
        appearance="ghost"
        onClick={decrement}
        disabled={atMin}
        label={label ? `Decrease ${label}` : 'Decrease'}
      />
      <Text
        variant={size === 'sm' ? 'body-sm' : 'body'}
        className={styles.value}
      >
        {displayValue}
      </Text>
      <IconButton
        icon={'add' as IconButtonProps['icon']}
        size="sm"
        appearance="ghost"
        onClick={increment}
        disabled={atMax}
        label={label ? `Increase ${label}` : 'Increase'}
      />
    </div>
  );
}
