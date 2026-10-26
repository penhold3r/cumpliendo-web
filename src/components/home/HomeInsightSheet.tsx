'use client';

import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './HomeInsightSheet.module.css';

type InsightKind = 'time' | 'sessions' | 'records' | 'muscles' | null;

interface HomeInsightSheetProps {
  kind: InsightKind;
  onDismiss: () => void;
}

export function HomeInsightSheet({ kind, onDismiss }: HomeInsightSheetProps) {
  const { t } = useTranslation();

  if (!kind) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <Text as="h2" variant="lead" className={styles.title}>
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
