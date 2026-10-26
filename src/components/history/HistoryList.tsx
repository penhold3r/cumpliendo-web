import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import { SessionCard } from './SessionCard';
import styles from './HistoryList.module.css';

interface HistoryListProps {
  sessions: {
    id: string;
    routineName: string;
    startedAt: string;
    durationSeconds: number;
    totalVolumeKg: number;
    completedSets: number;
    totalSets: number;
    exercises: unknown[];
    routineId?: string;
  }[];
  onEditSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
}

export function HistoryList({ sessions, onEditSession, onDeleteSession }: HistoryListProps) {
  const { t } = useTranslation();

  if (sessions.length === 0) {
    return (
      <div className={styles.empty}>
        <Text as="h2" variant="lead" className={styles.emptyTitle}>
          {t('history.emptyTitle')}
        </Text>
        <Text variant="body-sm" className={styles.emptyBody}>
          {t('history.emptyBody')}
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <Text as="h1" variant="display-lg" className={styles.title}>
          {t('history.title')}
        </Text>
      </div>
      <Text variant="body-sm" className={styles.subtitle}>
        {t('history.subtitle')}
      </Text>

      <div className={styles.cards}>
        {sessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            onEdit={onEditSession}
            onDelete={onDeleteSession}
          />
        ))}
      </div>
    </div>
  );
}
