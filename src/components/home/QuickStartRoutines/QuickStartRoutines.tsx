import { Button, Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './QuickStartRoutines.module.css';
import type { QuickStartRoutinesProps } from './QuickStartRoutines.types';

export function QuickStartRoutines({ routines, onStart, onExplore }: QuickStartRoutinesProps) {
  const { t } = useTranslation();

  if (routines.length === 0) {
    return (
      <div className={styles.empty}>
        <Text as="h3" variant="h5" className={styles.emptyTitle}>
          {t('home.noRoutines')}
        </Text>
        <Text variant="body-sm" className={styles.emptyBody}>
          {t('home.noRoutinesSub')}
        </Text>
        {onExplore && (
          <Button variant="neutral" size="sm" onClick={onExplore} className={styles.exploreButton}>
            {t('home.goToRoutines')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text as="h2" variant="h4" className={styles.title}>
          {t('home.routines')}
        </Text>
        {onExplore && (
          <Button variant="neutral" size="sm" onClick={onExplore}>
            {t('home.explore')}
          </Button>
        )}
      </div>

      <div className={styles.list}>
        {routines.slice(0, 2).map(routine => (
          <div key={routine.id} className={styles.routineCard}>
            <div className={styles.routineInfo}>
              <Text as="h3" variant="body" className={styles.routineName}>
                {routine.name}
              </Text>
              <Text variant="caption" className={styles.routineMeta}>
                {t('routineCard.estimated', { n: routine.estimatedMinutes })}
              </Text>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStart(routine)}
            >
              {t('routineCard.start')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
