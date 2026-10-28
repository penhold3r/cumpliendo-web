import { Button, Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import { RoutineCard } from '../RoutineCard';
import styles from './RoutineList.module.css';
import type { RoutineListProps } from './RoutineList.types';

export function RoutineList({ routines, onStartRoutine, onEditRoutine, onDeleteRoutine, onCreateRoutine }: RoutineListProps) {
  const { t } = useTranslation();

  if (routines.length === 0) {
    return (
      <div className={styles.empty}>
        <Text as="h2" variant="h4" className={styles.emptyTitle}>
          {t('routines.emptyTitle')}
        </Text>
        <Text variant="body-sm" className={styles.emptyBody}>
          {t('routines.emptyBody')}
        </Text>
        <Button
          variant="primary"
          size="md"
          className={styles.createButton}
          onClick={onCreateRoutine}
        >
          {t('routines.createFirst')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <Text as="h1" variant="display-lg" className={styles.title}>
          {t('routines.title')}
        </Text>
        {onCreateRoutine && (
          <Button
            variant="primary"
            size="sm"
            className={styles.createButton}
            onClick={onCreateRoutine}
          >
            {t('routines.new')}
          </Button>
        )}
      </div>
      <Text variant="body-sm" className={styles.subtitle}>
        {t('routines.subtitle')}
      </Text>

      <div className={styles.cards}>
        {routines.map(routine => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onStartRoutine={onStartRoutine}
            onEditRoutine={onEditRoutine}
            onDeleteRoutine={onDeleteRoutine}
          />
        ))}
      </div>
    </div>
  );
}
