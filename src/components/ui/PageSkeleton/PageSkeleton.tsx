import { Skeleton } from '@latty-ds/react';
import styles from './PageSkeleton.module.css';

function HomeSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.streakBlock}>
        <Skeleton width="60%" height="28px" />
        <Skeleton width="40%" height="16px" />
        <Skeleton width="100%" height="8px" />
        <div style={{ display: 'flex', gap: 'var(--lt-spacing-2)' }}>
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} shape="circle" width="32px" height="32px" />
          ))}
        </div>
      </div>

      <div className={styles.dashboard}>
        <div className={styles.column}>
          <Skeleton width="120px" height="20px" />
          <div className={styles.metricsGrid}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={styles.metricBlock}>
                <Skeleton width="60%" height="12px" />
                <Skeleton width="80%" height="24px" />
                <Skeleton width="50%" height="12px" />
              </div>
            ))}
          </div>
          <Skeleton width="140px" height="20px" />
          <div className={styles.metricBlock}>
            <Skeleton width="60%" height="20px" />
            <Skeleton width="40%" height="14px" />
          </div>
        </div>

        <div className={styles.column}>
          <Skeleton width="100px" height="20px" />
          <div className={styles.lineStack}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={styles.metricBlock}>
                <Skeleton width="70%" height="20px" />
                <Skeleton width="90%" height="14px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrainSkeleton() {
  return (
    <div className={styles.page}>
      <div>
        <Skeleton width="200px" height="32px" />
        <Skeleton width="160px" height="16px" style={{ marginTop: 8 }} />
      </div>
      <div className={styles.trainCards}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className={styles.trainCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lt-spacing-3)' }}>
              <Skeleton shape="circle" width="40px" height="40px" />
              <Skeleton width="60%" height="20px" />
            </div>
            <Skeleton width="90%" height="14px" />
            <Skeleton width="100%" height="40px" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RoutinesSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <Skeleton width="180px" height="32px" />
          <Skeleton width="140px" height="16px" style={{ marginTop: 8 }} />
        </div>
        <Skeleton width="140px" height="40px" />
      </div>
      <div className={styles.routineGrid}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className={styles.routineCard}>
            <Skeleton width="70%" height="20px" />
            <Skeleton width="90%" height="14px" />
            <div className={styles.chipRow}>
              <Skeleton width="60px" height="24px" />
              <Skeleton width="50px" height="24px" />
              <Skeleton width="70px" height="24px" />
            </div>
            <div className={styles.lineStack}>
              <Skeleton width="80%" height="14px" />
              <Skeleton width="65%" height="14px" />
              <Skeleton width="70%" height="14px" />
            </div>
            <Skeleton width="100%" height="36px" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ExercisesSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <Skeleton width="180px" height="32px" />
          <Skeleton width="140px" height="16px" style={{ marginTop: 8 }} />
        </div>
        <Skeleton width="140px" height="40px" />
      </div>
      <Skeleton width="100%" height="40px" style={{ maxWidth: '28rem' }} />
      <div className={styles.chipRow}>
        <Skeleton width="60px" height="28px" />
        <Skeleton width="70px" height="28px" />
        <Skeleton width="80px" height="28px" />
      </div>
      <div>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={styles.exerciseRow}>
            <Skeleton shape="circle" width="36px" height="36px" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
              <Skeleton width="50%" height="16px" />
              <Skeleton width="70%" height="12px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className={styles.page}>
      <div>
        <Skeleton width="180px" height="32px" />
        <Skeleton width="220px" height="16px" style={{ marginTop: 8 }} />
      </div>
      <div className={styles.lineStack}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={styles.metricBlock}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton width="60%" height="20px" />
              <Skeleton width="20%" height="16px" />
            </div>
            <Skeleton width="80%" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.profileShell}>
        <Skeleton width="100px" height="32px" />
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <Skeleton shape="circle" width="64px" height="64px" />
            <Skeleton width="140px" height="20px" />
            <Skeleton width="180px" height="14px" />
          </div>
        </div>
        <div className={styles.profileCard}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--lt-spacing-4)', textAlign: 'center' }}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <Skeleton width="48px" height="24px" />
                <Skeleton width="60px" height="12px" />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.profileCard}>
          <Skeleton width="120px" height="20px" />
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={styles.prefRow}>
              <Skeleton width="100px" height="16px" />
              <div style={{ display: 'flex', gap: 'var(--lt-spacing-2)' }}>
                <Skeleton width="60px" height="28px" />
                <Skeleton width="60px" height="28px" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton width="100%" height="40px" />
      </div>
    </div>
  );
}

export type PageSkeletonVariant = 'home' | 'train' | 'routines' | 'exercises' | 'history' | 'profile';

const SKELETONS: Record<PageSkeletonVariant, React.FC> = {
  home: HomeSkeleton,
  train: TrainSkeleton,
  routines: RoutinesSkeleton,
  exercises: ExercisesSkeleton,
  history: HistorySkeleton,
  profile: ProfileSkeleton,
};

export function PageSkeleton({ variant }: { variant: PageSkeletonVariant }) {
  const Component = SKELETONS[variant];
  return <Component />;
}
