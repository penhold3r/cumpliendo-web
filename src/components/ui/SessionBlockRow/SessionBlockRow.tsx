'use client';

import { Icon, Surface, Text, type IconProps } from '@latty-ds/react';
import {
  blockLabel,
  blockHint,
  BLOCK_ICONS,
  BLOCK_MAX_MINUTES,
  BLOCK_STEP_MINUTES,
} from '@/utils/sessionBlocks';
import { Stepper } from '../Stepper';
import styles from './SessionBlockRow.module.css';

interface SessionBlockRowProps {
  type: 'warmup' | 'cooldown';
  minutes: number;
  onChange: (minutes: number) => void;
}

export function SessionBlockRow({ type, minutes, onChange }: SessionBlockRowProps) {
  const active = minutes > 0;

  return (
    <Surface
      appearance="outlined"
      className={`${styles.row} ${active ? styles.active : ''}`}
    >
      <div className={styles.left}>
        <Icon
          name={BLOCK_ICONS[type] as IconProps['name']}
          size="sm"
          className={active ? styles.iconActive : styles.iconMuted}
        />
        <div className={styles.labels}>
          <Text variant="body" className={styles.label}>
            {blockLabel(type)}
          </Text>
          <Text variant="caption" className={styles.hint}>
            {blockHint(type)}
          </Text>
        </div>
      </div>
      <Stepper
        value={minutes}
        onChange={onChange}
        min={0}
        max={BLOCK_MAX_MINUTES}
        step={BLOCK_STEP_MINUTES}
        format={v => (v > 0 ? `${v} min` : '—')}
        label={blockLabel(type)}
        size="sm"
      />
    </Surface>
  );
}
