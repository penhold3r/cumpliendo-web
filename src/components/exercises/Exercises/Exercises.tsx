'use client';

import { useState, useMemo } from 'react';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  Icon,
  Tab,
  TabGroup,
  Text,
  Textfield,
  type IconProps,
} from '@latty-ds/react';
import {
  useTranslation,
  exerciseName,
  musclesLabel,
  muscleLabel,
  equipmentLabel,
  workoutTypeLabel,
} from '@/i18n';
import { INITIAL_EXERCISES } from '@/data/exercises';
import {
  MUSCLE_GROUP_OPTIONS,
  EQUIPMENT_OPTIONS,
  WORKOUT_TYPES,
  type ExerciseFilters,
  EMPTY_EXERCISE_FILTERS,
  hasActiveFilters,
} from '@/data/exerciseOptions';
import { matchesExerciseFilter } from '@/utils/exerciseFilter';
import { type Exercise } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getExerciseIcon } from '@/utils/exerciseIcon';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import styles from './Exercises.module.css';

type Scope = 'all' | 'mine';

export function Exercises() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const [scope, setScope] = useState<Scope>('all');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ExerciseFilters>(EMPTY_EXERCISE_FILTERS);

  const allExercises = INITIAL_EXERCISES;
  const mineExercises: Exercise[] = [];

  const baseList = scope === 'mine' ? mineExercises : allExercises;
  const filtered = useMemo(
    () => baseList.filter((ex: Exercise) => matchesExerciseFilter(ex, query, filters)),
    [baseList, query, filters],
  );

  const toggleFilter = <K extends keyof ExerciseFilters>(
    group: K,
    value: ExerciseFilters[K][number],
  ) => {
    const current = filters[group] as string[];
    const next = current.includes(value as string)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilters({ ...filters, [group]: next });
  };

  if (isLoading || !isAuthenticated) {
    return <PageSkeleton variant="exercises" />;
  }

  return (
    <div className={styles.shell}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.headerText}>
          <Text as="h1" variant="h1" className={styles.title}>
            {t('library.title')}
          </Text>
          <Text variant="body-sm" className={styles.subtitle}>
            {t('library.subtitle')}
          </Text>
        </div>
        <Button variant="secondary" size="md">
          <Icon name="plus" size="sm" />
          {t('library.new')}
        </Button>
      </div>

      {/* Tabs */}
      <TabGroup
        value={scope}
        onChange={(e: Event) => setScope((e as CustomEvent).detail.value as Scope)}
      >
        <Tab value="all">{t('library.scopeAll', { n: allExercises.length })}</Tab>
        <Tab value="mine">{t('library.scopeMine', { n: mineExercises.length })}</Tab>
      </TabGroup>

      {/* Search + Filters */}
      <div className={styles.toolbar}>
        <Textfield
          placeholder={t('library.searchPlaceholder')}
          value={query}
          iconStart={'search' as IconProps['name']}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          className={styles.searchField}
        />
        <div className={styles.filterChips}>
          <Dropdown placement="bottom-start">
            <Chip
              slot="trigger"
              size="md"
              appearance="outlined"
              variant={filters.types.length > 0 ? 'primary' : 'neutral'}
            >
              {filters.types.length > 0
                ? `${t('exercises.filterType', { defaultValue: 'Tipo' })} (${filters.types.length})`
                : t('exercises.filterType', { defaultValue: 'Tipo' })}
              <Icon name={'expand-more' as IconProps['name']} size="xs" />
            </Chip>
            {WORKOUT_TYPES.map(type => (
              <DropdownItem
                key={type}
                selected={filters.types.includes(type)}
                onSelect={() => toggleFilter('types', type)}
              >
                {workoutTypeLabel(type)}
              </DropdownItem>
            ))}
          </Dropdown>

          <Dropdown placement="bottom-start">
            <Chip
              slot="trigger"
              size="md"
              appearance="outlined"
              variant={filters.muscles.length > 0 ? 'primary' : 'neutral'}
            >
              {filters.muscles.length > 0
                ? `${t('exercises.filterMuscle', { defaultValue: 'Músculo' })} (${filters.muscles.length})`
                : t('exercises.filterMuscle', { defaultValue: 'Músculo' })}
              <Icon name={'expand-more' as IconProps['name']} size="xs" />
            </Chip>
            {MUSCLE_GROUP_OPTIONS.map(muscle => (
              <DropdownItem
                key={muscle}
                selected={filters.muscles.includes(muscle)}
                onSelect={() => toggleFilter('muscles', muscle)}
              >
                {muscleLabel(muscle)}
              </DropdownItem>
            ))}
          </Dropdown>

          <Dropdown placement="bottom-start">
            <Chip
              slot="trigger"
              size="md"
              appearance="outlined"
              variant={filters.equipment.length > 0 ? 'primary' : 'neutral'}
            >
              {filters.equipment.length > 0
                ? `${t('exercises.filterEquipment', { defaultValue: 'Equipamiento' })} (${filters.equipment.length})`
                : t('exercises.filterEquipment', { defaultValue: 'Equipamiento' })}
              <Icon name={'expand-more' as IconProps['name']} size="xs" />
            </Chip>
            {EQUIPMENT_OPTIONS.slice(0, 12).map(equip => (
              <DropdownItem
                key={equip}
                selected={filters.equipment.includes(equip)}
                onSelect={() => toggleFilter('equipment', equip)}
              >
                {equipmentLabel(equip)}
              </DropdownItem>
            ))}
          </Dropdown>

          {hasActiveFilters(filters) && (
            <Chip
              size="md"
              appearance="outlined"
              variant="error"
              onClick={() => setFilters(EMPTY_EXERCISE_FILTERS)}
            >
              <Icon name={'close' as IconProps['name']} size="xs" />
              {t('library.clearFilters')}
            </Chip>
          )}
        </div>

        {(hasActiveFilters(filters) || query) && (
          <div className={styles.activeFilters}>
            <Text variant="caption" className={styles.activeFiltersText}>
              {filtered.length} {t('library.results')}
              {query && ` · "${query}"`}
              {filters.types.length > 0 &&
                ` · ${t('exercises.filterType', { defaultValue: 'Tipo' })}: ${filters.types.map(wt => workoutTypeLabel(wt)).join(', ')}`}
              {filters.muscles.length > 0 &&
                ` · ${t('exercises.filterMuscle', { defaultValue: 'Músculo' })}: ${filters.muscles.map(m => muscleLabel(m)).join(', ')}`}
              {filters.equipment.length > 0 &&
                ` · ${t('exercises.filterEquipment', { defaultValue: 'Equipamiento' })}: ${filters.equipment.map(e => equipmentLabel(e)).join(', ')}`}
            </Text>
          </div>
        )}
      </div>

      {/* Exercise list */}
      {scope === 'mine' && mineExercises.length === 0 ? (
        <div className={styles.emptyState}>
          <Icon name={'fitness-center' as IconProps['name']} size="lg" className={styles.emptyIcon} />
          <Text as="h2" variant="h4" className={styles.emptyTitle}>
            {t('library.mineEmpty')}
          </Text>
          <Text variant="body-sm" className={styles.emptyBody}>
            {t('library.subtitle')}
          </Text>
          <Button variant="secondary" size="md">
            <Icon name="plus" size="sm" />
            {t('library.createNew')}
          </Button>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((exercise: Exercise) => {
            const icon = getExerciseIcon(exercise.equipment, exercise.category);
            const muscles = exercise.muscles || [exercise.category];
            const types = exercise.workoutTypes || [];

            return (
              <div key={exercise.id} className={styles.exerciseRow}>
                <span className={styles.exerciseIcon}>
                  <Icon name={icon as IconProps['name']} size="sm" />
                </span>
                <div className={styles.exerciseInfo}>
                  <Text variant="h6" className={styles.exerciseName}>
                    {exerciseName(exercise.id, exercise.name)}
                  </Text>
                  <Text variant="caption" className={styles.exerciseMeta}>
                    {[
                      musclesLabel(muscles),
                      equipmentLabel(exercise.equipment),
                      `${exercise.defaultRestSeconds}s`,
                      types.length > 0 ? types.map(t => workoutTypeLabel(t) ?? t).join(', ') : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className={styles.emptySearch}>
              <Text variant="body-sm" className={styles.emptySearchText}>
                {hasActiveFilters(filters)
                  ? t('library.emptyFiltered')
                  : t('library.noMatches', { query })}
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
