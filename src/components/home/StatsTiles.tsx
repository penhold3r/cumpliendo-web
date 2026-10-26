import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import { formatDurationReadable } from '@/utils/formatters';
import styles from './StatsTiles.module.css';

interface StatsTilesProps {
  time30: number;
  sessions30: number;
  latestRecord: string;
  restedMuscle: string;
}

export function StatsTiles({ time30, sessions30, latestRecord, restedMuscle }: StatsTilesProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.grid}>
      <div className={styles.tile}>
        <Text variant="caption" className={styles.label}>
          {t('home.time30')}
        </Text>
        <Text as="h3" variant="lead" className={styles.value}>
          {formatDurationReadable(time30)}
        </Text>
      </div>

      <div className={styles.tile}>
        <Text variant="caption" className={styles.label}>
          {t('home.sessions30')}
        </Text>
        <Text as="h3" variant="lead" className={styles.value}>
          {sessions30}
        </Text>
      </div>

      <div className={styles.tile}>
        <Text variant="caption" className={styles.label}>
          {t('home.latestRecord')}
        </Text>
        <Text as="h3" variant="lead" className={styles.value}>
          {latestRecord}
        </Text>
      </div>

      <div className={styles.tile}>
        <Text variant="caption" className={styles.label}>
          {t('home.restedLongest')}
        </Text>
        <Text as="h3" variant="lead" className={styles.value}>
          {restedMuscle}
        </Text>
      </div>
    </div>
  );
}
