'use client';

import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './FinishWorkoutDialog.module.css';
import type { FinishWorkoutDialogProps } from './FinishWorkoutDialog.types';

export function FinishWorkoutDialog({
  open,
  onConfirm,
  onDismiss,
  unfinishedSets = 0,
}: FinishWorkoutDialogProps) {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <Text as="h2" variant="h4" className={styles.title}>
          {t('finish.titleUnfinished')}
        </Text>
        <Text variant="body-sm" className={styles.body}>
          {unfinishedSets > 0
            ? t('finish.unfinishedMany', { n: unfinishedSets })
            : t('finish.subtitle')}
        </Text>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onDismiss}>
            {t('common.back')}
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            {t('finish.saveAndFinish')}
          </button>
        </div>
      </div>
    </div>
  );
}
