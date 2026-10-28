'use client';

import { Icon, Text, type IconProps } from '@latty-ds/react';
import { getExerciseIcon } from '@/utils/formatters';
import { musclesLabel, equipmentLabel } from '@/i18n/labels';
import styles from './ExerciseItemHeader.module.css';

interface ExerciseItemHeaderProps {
  exerciseName: string;
  category: string;
  equipment: string;
  muscles?: string[];
  actions?: React.ReactNode;
}

export function ExerciseItemHeader({
  exerciseName,
  category,
  equipment,
  muscles,
  actions,
}: ExerciseItemHeaderProps) {
  const iconName = getExerciseIcon(equipment, category);
  const muscleText = muscles?.length
    ? musclesLabel(muscles)
    : musclesLabel([category]);
  const equipText = equipmentLabel(equipment);
  const subtitle = [muscleText, equipText].filter(Boolean).join(' • ');

  return (
    <div className={styles.header}>
      <Icon name={iconName as IconProps['name']} size="sm" className={styles.icon} />
      <div className={styles.info}>
        <Text variant="body" className={styles.name}>
          {exerciseName}
        </Text>
        {subtitle && (
          <Text variant="caption" className={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
