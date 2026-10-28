import { Icon, Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import { formatDurationReadable } from '@/utils/formatters';
import styles from './StatsTiles.module.css';
import type { StatsTilesProps } from './StatsTiles.types';

export function StatsTiles({ time30, sessions30, latestRecord, restedMuscle }: StatsTilesProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.grid}>
      <div className={styles.tile}>
        <div className={styles.tileTop}>
          <span className={styles.iconCircle}>
            <Icon name="clock" size="sm" />
          </span>
          <Text variant="overline" className={styles.label}>
            {t('home.time30')}
          </Text>
        </div>
        <Text as="h3" variant="h4" className={styles.value}>
          {formatDurationReadable(time30)}
        </Text>
      </div>

      <div className={styles.tile}>
        <div className={styles.tileTop}>
          <span className={styles.iconCircle}>
            <Icon name="activity" size="sm" />
          </span>
          <Text variant="overline" className={styles.label}>
            {t('home.sessions30')}
          </Text>
        </div>
        <Text as="h3" variant="h4" className={styles.value}>
          {sessions30}
        </Text>
      </div>

      <div className={styles.tile}>
        <div className={styles.tileTop}>
          <span className={styles.iconCircle}>
            <Icon name="trending-up" size="sm" />
          </span>
          <Text variant="overline" className={styles.label}>
            {t('home.latestRecord')}
          </Text>
        </div>
        <Text as="h3" variant="h4" className={styles.value}>
          {latestRecord}
        </Text>
      </div>

      <div className={styles.tile}>
        <div className={styles.tileTop}>
          <span className={styles.iconCircle}>
            <Icon name="moon" size="sm" />
          </span>
          <Text variant="overline" className={styles.label}>
            {t('home.restedLongest')}
          </Text>
        </div>
        <Text as="h3" variant="h4" className={styles.value}>
          {restedMuscle}
        </Text>
      </div>
    </div>
  );
}
