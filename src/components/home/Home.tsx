'use client';

import { Button, Icon, Surface, Text } from '@latty-ds/react';
import { useAuth } from '@/context/AuthContext';
import { useWorkout } from '@/context/WorkoutContext';
import { useSettings } from '@/context/SettingsContext';
import { useTranslation } from '@/i18n';
import { useUnits } from '@/context/SettingsContext';
import {
  windowTotals,
  latestPersonalRecord,
  leastRecentMuscle,
} from '@/utils/homeInsights';
import { formatDurationReadable } from '@/utils/formatters';
import { DEFAULT_STARTER_ROUTINES } from '@/data/routines';
import styles from './Home.module.css';

export function Home() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const { state } = useWorkout();
  const { routines, history, isCloudSyncing } = state;
  const { formatWeight } = useUnits();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const last30 = windowTotals(history);
  const record = latestPersonalRecord(history);
  const rested = leastRecentMuscle(history);
  const lastSession = history[0];

  const changeText = (delta: number, format: (d: number) => string) =>
    delta === 0
      ? t('home.samePrevious')
      : t('home.vsPrevious', {
          delta: `${delta > 0 ? '+' : '−'}${format(delta)}`,
        });

  const trendOf = (delta: number): string =>
    delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';

  return (
    <div className={styles.page}>
      {/* Streak & Goal Banner */}
      <div className={styles.streakBanner}>
        <Text variant="lead" className={styles.streakText}>
          {t('streak.ongoing')}
        </Text>
      </div>

      {/* Numbers section */}
      <Text as="h2" variant="lead" className={styles.sectionTitle}>
        {t('home.numbers')}
      </Text>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <Text variant="caption" className={styles.metricLabel}>
            {t('home.time30')}
          </Text>
          <Text as="h3" variant="lead" className={styles.metricValue}>
            {formatDurationReadable(last30.current.seconds)}
          </Text>
          <Text variant="caption" className={styles.metricSub}>
            {changeText(
              last30.current.seconds - last30.previous.seconds,
              delta => formatDurationReadable(Math.abs(delta)),
            )}
          </Text>
        </div>

        <div className={styles.metricCard}>
          <Text variant="caption" className={styles.metricLabel}>
            {t('home.sessions30')}
          </Text>
          <Text as="h3" variant="lead" className={styles.metricValue}>
            {last30.current.sessions}
          </Text>
          <Text variant="caption" className={styles.metricSub}>
            {changeText(
              last30.current.sessions - last30.previous.sessions,
              delta => String(Math.abs(delta)),
            )}
          </Text>
        </div>

        <div className={styles.metricCard}>
          <Text variant="caption" className={styles.metricLabel}>
            {t('home.latestRecord')}
          </Text>
          <Text as="h3" variant="lead" className={styles.metricValue}>
            {record ? `${formatWeight(record.weightKg)} × ${record.reps}` : t('home.noRecord')}
          </Text>
          <Text variant="caption" className={styles.metricSub}>
            {record
              ? `${record.exerciseName} · ${record.startedAt}`
              : t('home.noRecordSub')}
          </Text>
        </div>

        <div className={styles.metricCard}>
          <Text variant="caption" className={styles.metricLabel}>
            {t('home.restedLongest')}
          </Text>
          <Text as="h3" variant="lead" className={styles.metricValue}>
            {rested ? rested.muscle : t('home.noRestedMuscle')}
          </Text>
          <Text variant="caption" className={styles.metricSub}>
            {rested
              ? t('home.restedSince', { when: rested.lastTrainedAt })
              : t('home.noRestedMuscleSub')}
          </Text>
        </div>
      </div>

      {/* Last session or empty state */}
      <Text as="h2" variant="lead" className={styles.sectionTitle}>
        {lastSession ? t('home.lastSession') : t('home.firstWorkout')}
      </Text>

      {lastSession ? (
        <Surface appearance="outlined" elevation="1" className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.lastSessionHeader}>
              <div>
                <Text as="h3" variant="lead" className={styles.cardTitle}>
                  {lastSession.routineName}
                </Text>
                <Text variant="body-sm" className={styles.cardSubtitle}>
                  {lastSession.startedAt} · {lastSession.durationSeconds}s
                </Text>
              </div>
              <Text variant="lead" className={styles.cardVolume}>
                {formatWeight(lastSession.totalVolumeKg)}
              </Text>
            </div>
          </div>
        </Surface>
      ) : (
        <Surface appearance="outlined" elevation="1" className={styles.card}>
          <div className={styles.cardBody}>
            <Text as="h3" variant="lead" className={styles.cardTitle}>
              {t('home.noWorkouts')}
            </Text>
            <Text variant="body-sm" className={styles.cardSubtitle}>
              {t('home.noWorkoutsSub')}
            </Text>
            <Button variant="primary" size="sm" fullWidth className={styles.emptyAction}>
              {t('home.trainNow')}
            </Button>
          </div>
        </Surface>
      )}

      {/* Available Routines or Empty State */}
      <Text as="h2" variant="lead" className={styles.sectionTitle}>
        {t('home.routines')}
      </Text>

      {routines.length > 0 ? (
        routines.slice(0, 2).map((routine: { id: string; name: string; description: string; category: string; estimatedMinutes: number; exercises: unknown[] }) => (
          <Surface key={routine.id} appearance="outlined" elevation="1" className={styles.card}>
            <div className={styles.cardBody}>
              <Text as="h3" variant="lead" className={styles.cardTitle}>
                {routine.name}
              </Text>
              <Text variant="body-sm" className={styles.cardSubtitle}>
                {routine.description}
              </Text>
            </div>
          </Surface>
        ))
      ) : (
        <Surface appearance="outlined" elevation="1" className={styles.card}>
          <div className={styles.cardBody}>
            <Text as="h3" variant="lead" className={styles.cardTitle}>
              {t('home.noRoutines')}
            </Text>
            <Text variant="body-sm" className={styles.cardSubtitle}>
              {t('home.noRoutinesSub')}
            </Text>
            <Button variant="neutral" size="sm" fullWidth className={styles.emptyAction}>
              {t('home.goToRoutines')}
            </Button>
          </div>
        </Surface>
      )}
    </div>
  );
}
