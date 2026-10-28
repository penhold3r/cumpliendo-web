'use client';

import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './RestTimer.module.css';
import type { RestTimerProps } from './RestTimer.types';

export function RestTimer({
  remainingSeconds,
  initialSeconds,
  exerciseName,
  onSkip,
  onAdjust,
}: RestTimerProps) {
  const { t } = useTranslation();

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const progress = initialSeconds > 0 ? remainingSeconds / initialSeconds : 0;

  return (
    <div className={styles.timer}>
      <div className={styles.header}>
        {exerciseName && (
          <Text variant="body-sm" className={styles.exerciseName}>
            {t('restTimer.restFor', { name: exerciseName })}
          </Text>
        )}
      </div>

      <div className={styles.timeDisplay}>
        <Text as="h2" variant="display-lg" className={styles.time}>
          {timeStr}
        </Text>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.adjustButton}
          onClick={() => onAdjust?.(-30)}
          aria-label={t('restTimer.minus30')}
        >
          -30
        </button>
        <button
          className={styles.skipButton}
          onClick={onSkip}
          aria-label={t('restTimer.skip')}
        >
          {t('restTimer.skip')}
        </button>
        <button
          className={styles.adjustButton}
          onClick={() => onAdjust?.(30)}
          aria-label={t('restTimer.plus30')}
        >
          +30
        </button>
      </div>
    </div>
  );
}
