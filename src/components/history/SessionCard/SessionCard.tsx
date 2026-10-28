'use client';

import { Surface, Text } from '@latty-ds/react';
import { useTranslation, sessionTitle } from '@/i18n';
import { formatDurationReadable } from '@/utils/formatters';
import styles from './SessionCard.module.css';
import type { SessionCardProps } from './SessionCard.types';

export function SessionCard({ session, onEdit, onDelete }: SessionCardProps) {
  const { t } = useTranslation();

  return (
    <Surface appearance="outlined" elevation="1" className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.header}>
          <div className={styles.info}>
            <Text as="h3" variant="h5" className={styles.title}>
              {sessionTitle(session)}
            </Text>
            <Text variant="body-sm" className={styles.subtitle}>
              {session.startedAt} · {formatDurationReadable(session.durationSeconds)}
            </Text>
          </div>
          <div className={styles.stats}>
            <Text variant="h5" className={styles.volume}>
              {session.totalVolumeKg.toLocaleString()} kg
            </Text>
            <Text variant="caption" className={styles.sets}>
              {session.completedSets}/{session.totalSets}
            </Text>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className={styles.actions}>
            {onEdit && (
              <button
                className={styles.actionButton}
                onClick={() => onEdit(session.id)}
                aria-label={t('history.editSession')}
              >
                {t('history.editSession')}
              </button>
            )}
            {onDelete && (
              <button
                className={styles.actionButton}
                onClick={() => onDelete(session.id)}
                aria-label={t('history.editSession')}
              >
                {t('common.delete')}
              </button>
            )}
          </div>
        )}
      </div>
    </Surface>
  );
}
