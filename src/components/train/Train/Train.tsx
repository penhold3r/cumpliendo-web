'use client';

import { Button, Icon, Surface, Text } from '@latty-ds/react';
import { useAuth } from '@/context/AuthContext';
import { useWorkout } from '@/context/WorkoutContext';
import { useTranslation } from '@/i18n';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import styles from './Train.module.css';

export function Train() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const { state } = useWorkout();
  const { activeWorkout } = state;

  if (isLoading || !isAuthenticated) {
    return <PageSkeleton variant="train" />;
  }

  // Hub view: 3 action cards when no active workout
  if (!activeWorkout) {
    return (
      <div className={styles.hub}>
        <div className={styles.hubHeader}>
          <Text as="h1" variant="h1" className={styles.title}>
            {t('train.title')}
          </Text>
          <Text variant="body-sm" className={styles.subtitle}>
            {t('train.subtitle')}
          </Text>
        </div>

        <div className={styles.cards}>
          {/* Card 1: Free Workout */}
          <Surface appearance="outlined" elevation="1" className={styles.card}>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <span className={styles.iconCircle}>
                  <Icon name="clock" size="md" />
                </span>
                <Text as="h2" variant="h4" className={styles.cardTitle}>
                  {t('common.freeWorkout')}
                </Text>
              </div>
              <Text variant="body-sm" className={styles.cardDescription}>
                {t('train.freeBody')}
              </Text>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  // TODO: start free workout
                }}
              >
                {t('train.startLive')}
              </Button>
            </div>
          </Surface>

          {/* Card 2: Choose from My Routines */}
          <Surface appearance="outlined" elevation="1" className={styles.card}>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <span className={styles.iconCircle}>
                  <Icon name="clipboard" size="md" />
                </span>
                <Text as="h2" variant="h4" className={styles.cardTitle}>
                  {t('train.fromRoutines')}
                </Text>
              </div>
              <Text variant="body-sm" className={styles.cardDescription}>
                {t('train.fromRoutinesBody')}
              </Text>
              <Button
                variant="neutral"
                size="md"
                fullWidth
                onClick={() => {
                  // TODO: navigate to routines
                }}
              >
                {t('train.seeRoutines')}
              </Button>
            </div>
          </Surface>

          {/* Card 3: Log Completed Class or WOD */}
          <Surface appearance="outlined" elevation="1" className={styles.card}>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <span className={styles.iconCircle}>
                  <Icon name="check-circle" size="md" />
                </span>
                <Text as="h2" variant="h4" className={styles.cardTitle}>
                  {t('train.logClass')}
                </Text>
              </div>
              <Text variant="body-sm" className={styles.cardDescription}>
                {t('train.logClassBody')}
              </Text>
              <Button
                variant="neutral"
                size="md"
                fullWidth
                onClick={() => {
                  // TODO: open log past modal
                }}
              >
                {t('train.logDone')}
              </Button>
            </div>
          </Surface>
        </div>
      </div>
    );
  }

  // Active workout view
  return (
    <div className={styles.activeWorkout}>
      <Text as="h1" variant="h1" className={styles.title}>
        {activeWorkout.routineName}
      </Text>
      <Text variant="body-sm" className={styles.subtitle}>
        {activeWorkout.exercises.length} exercises · {activeWorkout.totalSets} sets
      </Text>

      <div className={styles.exercises}>
        {activeWorkout.exercises.map(exercise => (
          <Surface
            key={exercise.id}
            appearance="outlined"
            elevation="1"
            className={styles.exerciseCard}
          >
            <div className={styles.cardBody}>
              <Text as="h2" variant="h4" className={styles.cardTitle}>
                {exercise.exerciseName}
              </Text>
              <Text variant="body-sm" className={styles.cardSubtitle}>
                {exercise.sets.length} sets
              </Text>
            </div>
          </Surface>
        ))}
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => {
            // TODO: finish workout
          }}
        >
          {t('train.finishWorkout')}
        </Button>
        <Button
          variant="neutral"
          size="md"
          fullWidth
          onClick={() => {
            // TODO: cancel workout
          }}
        >
          {t('train.discard')}
        </Button>
      </div>
    </div>
  );
}
