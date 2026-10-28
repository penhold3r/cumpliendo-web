'use client';

import { Button, Icon, IconButton, Progress, Surface, Text } from '@latty-ds/react';
import { useAuth } from '@/context/AuthContext';
import { useWorkout } from '@/context/WorkoutContext';
import { useTranslation } from '@/i18n';
import { useUnits } from '@/context/SettingsContext';
import {
  windowTotals,
  latestPersonalRecord,
  leastRecentMuscle,
} from '@/utils/homeInsights';
import { formatDurationReadable } from '@/utils/formatters';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import styles from './Home.module.css';

const DAY_KEYS = ['0', '1', '2', '3', '4', '5', '6'] as const;

export function Home() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const { state } = useWorkout();
  const { routines, history } = state;
  const { formatWeight } = useUnits();

  if (isLoading || !isAuthenticated) {
    return <PageSkeleton variant="home" />;
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

  const todayIdx = String((new Date().getDay() + 6) % 7);

  return (
    <div className={styles.page}>
      {/* Rich Streak Card */}
      <Surface appearance="outlined" elevation="1" className={styles.streakCard}>
        <div className={styles.streakBody}>
          <Text as="h2" variant="h3" className={styles.streakTitle}>
            {t('streak.startToday')}
          </Text>
          <Text variant="body-sm" className={styles.streakSubtitle}>
            {t('streak.firstHint')}
          </Text>
          <Text variant="caption" className={styles.streakRecord}>
            {t('streak.best', { weeks: t('common.weekOne', { n: 1 }) })}
          </Text>

          <div className={styles.goalRow}>
            <div className={styles.goalLabel}>
              <Text variant="body-sm" className={styles.goalText}>
                {t('streak.weeklyGoal')}
              </Text>
              <IconButton icon="edit" size="sm" label={t('streak.adjustGoal')} />
            </div>
            <Text variant="body-sm" className={styles.goalCount}>
              0 {t('streak.ofDays', { n: 3 })}
            </Text>
          </div>

          <Progress value={0} max={3} size="sm" variant="primary" />

          <div className={styles.dayCircles}>
            {DAY_KEYS.map(idx => (
              <span
                key={idx}
                className={`${styles.dayCircle} ${idx === todayIdx ? styles.dayToday : ''}`}
              >
                {t(`days.short.${idx}`)}
              </span>
            ))}
          </div>
        </div>
      </Surface>

      {/* Dashboard grid: metrics + content */}
      <div className={styles.dashboard}>
        {/* Left column: metrics + last session */}
        <div className={styles.dashLeft}>
          <Text as="h2" variant="h4" className={styles.sectionTitle}>
            {t('home.numbers')}
          </Text>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricTop}>
                <span className={styles.metricIconCircle}>
                  <Icon name="clock" size="sm" />
                </span>
                <Text variant="caption" className={styles.metricLabel}>
                  {t('home.time30')}
                </Text>
              </div>
              <Text as="h3" variant="h4" className={styles.metricValue}>
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
              <div className={styles.metricTop}>
                <span className={styles.metricIconCircle}>
                  <Icon name="activity" size="sm" />
                </span>
                <Text variant="caption" className={styles.metricLabel}>
                  {t('home.sessions30')}
                </Text>
              </div>
              <Text as="h3" variant="h4" className={styles.metricValue}>
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
              <div className={styles.metricTop}>
                <span className={styles.metricIconCircle}>
                  <Icon name="trending-up" size="sm" />
                </span>
                <Text variant="caption" className={styles.metricLabel}>
                  {t('home.latestRecord')}
                </Text>
              </div>
              <Text as="h3" variant="h4" className={styles.metricValue}>
                {record ? `${formatWeight(record.weightKg)} × ${record.reps}` : t('home.noRecord')}
              </Text>
              <Text variant="caption" className={styles.metricSub}>
                {record
                  ? `${record.exerciseName} · ${record.startedAt}`
                  : t('home.noRecordSub')}
              </Text>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricTop}>
                <span className={styles.metricIconCircle}>
                  <Icon name="moon" size="sm" />
                </span>
                <Text variant="caption" className={styles.metricLabel}>
                  {t('home.restedLongest')}
                </Text>
              </div>
              <Text as="h3" variant="h4" className={styles.metricValue}>
                {rested ? rested.muscle : t('home.noRestedMuscle')}
              </Text>
              <Text variant="caption" className={styles.metricSub}>
                {rested
                  ? t('home.restedSince', { when: rested.lastTrainedAt })
                  : t('home.noRestedMuscleSub')}
              </Text>
            </div>
          </div>

          {/* Last session */}
          <Text as="h2" variant="h4" className={styles.sectionTitle}>
            {lastSession ? t('home.lastSession') : t('home.firstWorkout')}
          </Text>

          {lastSession ? (
            <Surface appearance="outlined" elevation="1" className={styles.card}>
              <div className={styles.cardBody}>
                <div className={styles.lastSessionHeader}>
                  <div>
                    <Text as="h3" variant="h5" className={styles.cardTitle}>
                      {lastSession.routineName}
                    </Text>
                    <Text variant="body-sm" className={styles.cardSubtitle}>
                      {lastSession.startedAt} · {lastSession.durationSeconds}s
                    </Text>
                  </div>
                  <Text variant="h5" className={styles.cardVolume}>
                    {formatWeight(lastSession.totalVolumeKg)}
                  </Text>
                </div>
              </div>
            </Surface>
          ) : (
            <Surface appearance="outlined" elevation="1" className={styles.card}>
              <div className={styles.cardBody}>
                <Text as="h3" variant="h5" className={styles.cardTitle}>
                  {t('home.noWorkouts')}
                </Text>
                <Text variant="body-sm" className={styles.cardSubtitle}>
                  {t('home.noWorkoutsSub')}
                </Text>
                <Button variant="primary" size="sm" className={styles.emptyAction}>
                  {t('home.trainNow')}
                </Button>
              </div>
            </Surface>
          )}
        </div>

        {/* Right column: routines */}
        <div className={styles.dashRight}>
          <Text as="h2" variant="h4" className={styles.sectionTitle}>
            {t('home.routines')}
          </Text>

          {routines.length > 0 ? (
            <div className={styles.routineStack}>
              {routines.slice(0, 3).map((routine: { id: string; name: string; description: string; category: string; estimatedMinutes: number; exercises: unknown[] }) => (
                <Surface key={routine.id} appearance="outlined" elevation="1" className={styles.card}>
                  <div className={styles.cardBody}>
                    <Text as="h3" variant="h5" className={styles.cardTitle}>
                      {routine.name}
                    </Text>
                    <Text variant="body-sm" className={styles.cardSubtitle}>
                      {routine.description}
                    </Text>
                  </div>
                </Surface>
              ))}
            </div>
          ) : (
            <Surface appearance="outlined" elevation="1" className={styles.card}>
              <div className={styles.cardBody}>
                <Text as="h3" variant="h5" className={styles.cardTitle}>
                  {t('home.noRoutines')}
                </Text>
                <Text variant="body-sm" className={styles.cardSubtitle}>
                  {t('home.noRoutinesSub')}
                </Text>
                <Button variant="neutral" size="sm" className={styles.emptyAction}>
                  {t('home.goToRoutines')}
                </Button>
              </div>
            </Surface>
          )}
        </div>
      </div>
    </div>
  );
}
