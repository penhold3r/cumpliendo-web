'use client';

import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './HomeInsightSheet.module.css';
import type { HomeInsightSheetProps } from './HomeInsightSheet.types';


export function HomeInsightSheet({ kind, onDismiss }: HomeInsightSheetProps) {
  const { t } = useTranslation();

  if (!kind) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <Text as="h2" variant="h4" className={styles.title}>
            {t('insights.open')}
          </Text>
          <button
            className={styles.closeButton}
            onClick={onDismiss}
            aria-label={t('common.close')}
          >
            {t('common.close')}
          </button>
        </div>
        <Text variant="body-sm" className={styles.body}>
          {t('insights.nothingYet')}
        </Text>
      </div>
    </div>
  );
}
