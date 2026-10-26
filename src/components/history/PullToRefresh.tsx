'use client';

import { useState } from 'react';
import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './PullToRefresh.module.css';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.refreshBar}>
        <button
          className={styles.refreshButton}
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh"
        >
          {isRefreshing ? '...' : '↻'}
        </button>
        <Text variant="caption" className={styles.label}>
          {t('sync.retry')}
        </Text>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
