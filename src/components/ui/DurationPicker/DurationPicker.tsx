'use client';

import { Chip } from '@latty-ds/react';
import { Stepper } from '../Stepper';
import styles from './DurationPicker.module.css';

const DEFAULT_PRESETS = [30, 45, 60];

interface DurationPickerProps {
  value: number;
  onChange: (minutes: number) => void;
  presets?: number[];
}

export function DurationPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
}: DurationPickerProps) {
  return (
    <div className={styles.picker}>
      <div className={styles.presets}>
        {presets.map(p => (
          <Chip
            key={p}
            selected={value === p}
            onClick={() => onChange(p)}
            size="sm"
          >
            {p} min
          </Chip>
        ))}
      </div>
      <Stepper
        value={value}
        onChange={onChange}
        min={5}
        max={240}
        step={5}
        format={v => `${v} min`}
        label="Duration"
      />
    </div>
  );
}
