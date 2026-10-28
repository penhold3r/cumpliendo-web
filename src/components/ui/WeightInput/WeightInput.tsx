'use client';

import { Chip, Text } from '@latty-ds/react';
import { useUnits } from '@/context/SettingsContext/useUnits.hook';
import styles from './WeightInput.module.css';

interface WeightInputProps {
  weightKg: number;
  onChange: (kg: number) => void;
  weightPerSide?: boolean;
  onPerSideChange?: (value: boolean) => void;
  disabled?: boolean;
}

export function WeightInput({
  weightKg,
  onChange,
  weightPerSide,
  onPerSideChange,
  disabled,
}: WeightInputProps) {
  const { unitLabel, toDisplay, fromDisplay } = useUnits();

  const displayValue = toDisplay(weightKg);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    if (!Number.isNaN(raw)) {
      onChange(fromDisplay(raw));
    } else if (e.target.value === '') {
      onChange(0);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputGroup}>
        <input
          type="number"
          className={styles.input}
          value={displayValue || ''}
          onChange={handleChange}
          disabled={disabled}
          min={0}
          step="any"
          aria-label={`Weight (${unitLabel})`}
          inputMode="decimal"
        />
        <Text variant="body-sm" className={styles.unit}>
          {unitLabel}
        </Text>
      </div>
      {onPerSideChange && (
        <Chip
          selected={weightPerSide}
          onClick={() => onPerSideChange(!weightPerSide)}
          size="sm"
        >
          ×2
        </Chip>
      )}
    </div>
  );
}
