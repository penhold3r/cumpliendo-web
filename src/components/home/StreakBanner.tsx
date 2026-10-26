import { Surface, Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './StreakBanner.module.css';

interface StreakBannerProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakBanner({ currentStreak, bestStreak }: StreakBannerProps) {
  const { t } = useTranslation();

  return (
    <Surface appearance="outlined" elevation="1" className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.streakInfo}>
          <Text as="h2" variant="lead" className={styles.current}>
            {currentStreak}
          </Text>
          <Text variant="body-sm" className={styles.label}>
            {t('streak.ongoing')}
          </Text>
        </div>
        <Text variant="caption" className={styles.best}>
          {t('streak.best', { weeks: bestStreak })}
        </Text>
      </div>
    </Surface>
  );
}
