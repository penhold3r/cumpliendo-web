'use client';

import { useMemo } from 'react';
import { Button, Chip, Divider, Icon, IconButton, Surface, Text, type IconProps, type IconButtonProps } from '@latty-ds/react';
import { useTranslation, routineText, exerciseName, routineCategoryLabel } from '@/i18n';
import { DEFAULT_STARTER_ROUTINES } from '@/data/routines';
import { INITIAL_EXERCISES } from '@/data/exercises';
import { type Routine } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import styles from './Routines.module.css';

const PREVIEW_COUNT = 4;

const routineLabel = (routine: Routine, field: 'name' | 'description') =>
  routineText(routine.id, field, routine[field]);

export function Routines() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();

  const exerciseMap = useMemo(
    () => new Map(INITIAL_EXERCISES.map(e => [e.id, e])),
    [],
  );

  if (isLoading || !isAuthenticated) {
    return <PageSkeleton variant="routines" />;
  }

  if (DEFAULT_STARTER_ROUTINES.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">
          <Icon name="clipboard" size="lg" />
        </span>
        <Text as="h2" variant="h4" className={styles.emptyTitle}>
          {t('routines.emptyTitle')}
        </Text>
        <Text variant="body-sm" className={styles.emptyBody}>
          {t('routines.emptyBody')}
        </Text>
        <Button variant="primary" size="md" className={styles.emptyAction}>
          {t('routines.createFirst')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.headerRow}>
        <div className={styles.headerText}>
          <Text as="h1" variant="h1" className={styles.title}>
            {t('routines.title')}
          </Text>
          <Text variant="body-sm" className={styles.subtitle}>
            {t('routines.subtitle')}
          </Text>
        </div>
        <Button variant="secondary" size="md">
          <Icon name="plus" size="sm" />
          {t('routines.new')}
        </Button>
      </div>

      <div className={styles.list}>
        {DEFAULT_STARTER_ROUTINES.map(routine => {
          const preview = routine.exercises.slice(0, PREVIEW_COUNT);
          const remaining = routine.exercises.length - PREVIEW_COUNT;

          return (
            <Surface
              key={routine.id}
              appearance="outlined"
              elevation="1"
              className={styles.card}
            >
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <Text as="h2" variant="h4" className={styles.name}>
                    {routineLabel(routine, 'name')}
                  </Text>
                  <div className={styles.cardActions}>
                    <IconButton
                      icon="edit"
                      size="sm"
                      label={t('routineCard.edit')}
                    />
                    <IconButton
                      icon={'trash-2' as IconButtonProps['icon']}
                      size="sm"
                      label={t('routineCard.delete')}
                    />
                  </div>
                </div>

                <Text variant="body-sm" className={styles.description}>
                  {routineLabel(routine, 'description')}
                </Text>

                <div className={styles.chipRow}>
                  <Chip size="sm" appearance="filled" variant="primary">
                    {routineCategoryLabel(routine.category)}
                  </Chip>
                  <Chip size="sm" appearance="outlined" variant="neutral">
                    {t('routineCard.estimated', { n: routine.estimatedMinutes })}
                  </Chip>
                  <Chip size="sm" appearance="outlined" variant="neutral">
                    {t('common.exercisesN', { n: routine.exercises.length })}
                  </Chip>
                </div>

                <Divider />

                <ul className={styles.exercisePreview}>
                  {preview.map(tmpl => {
                    const ex = exerciseMap.get(tmpl.exerciseId);
                    const name = ex
                      ? exerciseName(ex.id, ex.name)
                      : tmpl.exerciseId;
                    const setsReps = tmpl.defaultSets + ' × ' + tmpl.defaultReps;
                    return (
                      <li key={tmpl.exerciseId} className={styles.exerciseItem}>
                        <span className={styles.exerciseName}>{name}</span>
                        <span className={styles.exerciseSetsReps}>{setsReps}</span>
                      </li>
                    );
                  })}
                </ul>

                {remaining > 0 && (
                  <span className={styles.moreLink}>
                    {t('routineCard.more', { n: remaining })}
                  </span>
                )}

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  className={styles.startButton}
                  onClick={() => {
                    // TODO: navigate to active workout for this routine
                  }}
                >
                  <Icon name={'play-arrow' as IconProps['name']} size="sm" />
                  {t('routineCard.start')}
                </Button>
              </div>
            </Surface>
          );
        })}
      </div>
    </div>
  );
}
