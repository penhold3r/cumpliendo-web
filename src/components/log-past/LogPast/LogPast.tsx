'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button, IconButton, Surface, Text, type IconProps } from '@latty-ds/react';
import { useTranslation, exerciseName as exName } from '@/i18n';
import { useWorkout } from '@/context/WorkoutContext';
import { WORKOUT_TYPES } from '@/data/exerciseOptions';
import { isAmrap, DEFAULT_AMRAP_MINUTES } from '@/utils/circuitTiming';
import { isBodyweight } from '@/utils/workoutUtils';
import { useLogPastWorkout } from './useLogPastWorkout.hook';
import {
  calendarMonthLabel,
  calendarDayLetters,
  isToday,
  isYesterday,
} from './LogPast.utils';
import { Stepper } from '../../ui/Stepper';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { AddExerciseDialog } from '../../ui/AddExerciseDialog';
import { SessionBlockRow } from '../../ui/SessionBlockRow';
import { WeightInput } from '../../ui/WeightInput';
import { DurationPicker } from '../../ui/DurationPicker';
import { ExerciseItemHeader } from '../../ui/ExerciseItemHeader';
import type { PastWorkoutExerciseItem, CircuitBlockType, WorkoutCircuit } from '@/types';
import styles from './LogPast.module.css';

const WOD_FORMATS = [
  'circuit',
  'for_time',
  'amrap',
  'emom',
  'tabata',
  'rounds',
  'free',
] as const;

const NEEDS_WOD_FORMAT: string[] = [
  'functional',
  'crossfit',
  'hiit',
  'class',
];

function dateLabel(date: Date, t: (key: string) => string): string {
  if (isToday(date)) return t('common.today');
  if (isYesterday(date)) return t('common.yesterday');
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function LogPast() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { state } = useWorkout();

  const sessionId = searchParams.get('sessionId');
  const initialSession = sessionId
    ? state.history.find((s: { id: string }) => s.id === sessionId) ?? null
    : null;

  const h = useLogPastWorkout({
    initialSession,
    onBack: () => router.back(),
  });

  const showWodFormat = NEEDS_WOD_FORMAT.includes(h.workoutType);

  return (
    <div className={styles.screen}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <IconButton
          icon={'arrow-left' as IconProps['name']}
          variant="neutral"
          appearance="ghost"
          size="sm"
          onClick={h.handleBack}
          label={t('common.back')}
        />
        <Text variant="h4" className={styles.headerTitle}>
          {h.isEditing ? t('logSession.editTitle') : t('logSession.title')}
        </Text>
        <Button variant="primary" size="sm" onClick={h.handleSave}>
          {h.isEditing ? t('logSession.saveChanges') : t('logSession.save')}
        </Button>
      </header>

      <div className={styles.body}>
        {/* ── Date Section ── */}
        <section className={styles.section}>
          <Text variant="overline">{t('logSession.date')}</Text>
          <div className={styles.dateRow}>
            <Button
              variant={isToday(h.selectedDate) ? 'primary' : 'neutral'}
              appearance={isToday(h.selectedDate) ? 'filled' : 'outlined'}
              size="sm"
              onClick={() => h.handleSelectQuickDate('today')}
            >
              {t('common.today')}
            </Button>
            <Button
              variant={isYesterday(h.selectedDate) ? 'primary' : 'neutral'}
              appearance={isYesterday(h.selectedDate) ? 'filled' : 'outlined'}
              size="sm"
              onClick={() => h.handleSelectQuickDate('yesterday')}
            >
              {t('common.yesterday')}
            </Button>
            <IconButton
              icon={'calendar' as IconProps['name']}
              variant="neutral"
              appearance="ghost"
              size="sm"
              onClick={h.openCalendar}
              label={t('logSession.pickDate')}
            />
            <Text variant="body" className={styles.dateDisplay}>
              {dateLabel(h.selectedDate, t)}
            </Text>
          </div>
        </section>

        {/* ── Workout Type ── */}
        <section className={styles.section}>
          <Text variant="overline">{t('logSession.workoutType')}</Text>
          <div className={styles.chipGroup}>
            {WORKOUT_TYPES.map(wt => (
              <button
                key={wt}
                className={`${styles.chip} ${h.workoutType === wt ? styles.chipSelected : ''}`}
                onClick={() => h.setWorkoutType(wt)}
              >
                {t(`data.workoutType.${wt}`)}
              </button>
            ))}
          </div>
        </section>

        {/* ── WOD Format ── */}
        {showWodFormat && (
          <section className={styles.section}>
            <Text variant="overline">{t('logSession.format')}</Text>
            <div className={styles.chipGroup}>
              {WOD_FORMATS.map(f => (
                <button
                  key={f}
                  className={`${styles.chip} ${h.wodFormat === f ? styles.chipSelected : ''}`}
                  onClick={() => h.setWodFormat(f)}
                >
                  {t(`data.wodFormat.${f}`)}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Structure Mode ── */}
        <section className={styles.section}>
          <Text variant="overline">{t('logSession.structure')}</Text>
          <div className={styles.chipGroup}>
            <button
              className={`${styles.chip} ${h.structureMode === 'circuit' ? styles.chipSelected : ''}`}
              onClick={() => h.setStructureMode('circuit')}
            >
              {t('logSession.byCircuits')}
            </button>
            <button
              className={`${styles.chip} ${h.structureMode === 'simple' ? styles.chipSelected : ''}`}
              onClick={() => h.setStructureMode('simple')}
            >
              {t('logSession.simpleList')}
            </button>
          </div>
        </section>

        {/* ── Circuit Mode ── */}
        {h.structureMode === 'circuit' && (
          <section className={styles.section}>
            <Text variant="overline">
              {t('logSession.circuits', { n: h.circuits.length })}
            </Text>
            <Text variant="caption">{t('logSession.circuitsHint')}</Text>

            {h.circuits.map((circuit, ci) => (
              <CircuitBlock
                key={circuit.id}
                circuit={circuit}
                index={ci}
                canRemove={h.circuits.length > 1}
                onRemove={() => h.handleRemoveCircuit(circuit.id)}
                onSetBlockType={(bt) => h.handleSetCircuitBlockType(circuit.id, bt)}
                onUpdateField={(field, val) =>
                  h.handleUpdateCircuitField(circuit.id, field, val)
                }
                onUpdateExercise={(exIdx, updates) =>
                  h.handleUpdateCircuitExerciseValues(circuit.id, exIdx, updates)
                }
                onRemoveExercise={(exIdx) =>
                  h.handleRemoveCircuitExercise(circuit.id, exIdx)
                }
                onAddExercise={() =>
                  h.setAddExerciseTarget({ targetCircuitId: circuit.id })
                }
                exercises={state.exercises}
              />
            ))}

            <Button
              variant="neutral"
              appearance="outlined"
              size="sm"
              onClick={h.handleAddCircuit}
            >
              {t('logSession.addCircuit', { n: h.circuits.length + 1 })}
            </Button>
          </section>
        )}

        {/* ── Simple Mode ── */}
        {h.structureMode === 'simple' && (
          <section className={styles.section}>
            <Text variant="overline">
              {t('logSession.exercises', { n: h.exerciseItems.length })}
            </Text>
            <Text variant="caption">{t('logSession.exercisesHint')}</Text>

            {h.exerciseItems.length === 0 ? (
              <Text variant="body-sm" className={styles.emptyList}>
                {t('logSession.emptyList')}
              </Text>
            ) : (
              h.exerciseItems.map((item, idx) => (
                <ExerciseRow
                  key={`flat-${idx}`}
                  item={item}
                  exercises={state.exercises}
                  onUpdate={(updates) => h.handleUpdateFlatExerciseValues(idx, updates)}
                  onRemove={() => h.handleRemoveFlatExercise(idx)}
                />
              ))
            )}

            <Button
              variant="neutral"
              appearance="outlined"
              size="sm"
              onClick={() => h.setAddExerciseTarget({})}
            >
              {t('logSession.addToList')}
            </Button>
          </section>
        )}

        {/* ── Duration ── */}
        <section className={styles.section}>
          <Text variant="overline">
            {t('logSession.duration', { n: h.effectiveDurationMinutes })}
          </Text>
          <DurationPicker
            value={h.durationMinutes}
            onChange={h.setDurationMinutes}
          />
        </section>

        {/* ── Warmup / Cooldown ── */}
        <section className={styles.section}>
          <SessionBlockRow
            type="warmup"
            minutes={h.warmupMinutes}
            onChange={h.setWarmupMinutes}
          />
          <SessionBlockRow
            type="cooldown"
            minutes={h.cooldownMinutes}
            onChange={h.setCooldownMinutes}
          />
          {(h.warmupMinutes > 0 || h.cooldownMinutes > 0) && (
            <Text variant="caption">
              {t('logSession.totalWithBlocks', { n: h.totalDurationMinutes })}
            </Text>
          )}
        </section>

        {/* ── Metrics Summary ── */}
        <section className={styles.section}>
          <div className={styles.metricsGrid}>
            <MetricCard
              label={t('logSession.exercises', { n: h.metrics.totalExercisesCount })}
              value={String(h.metrics.totalExercisesCount)}
            />
            <MetricCard
              label={t('common.sets')}
              value={String(h.metrics.totalSets)}
            />
            <MetricCard
              label={t('logSession.volume')}
              value={`${Math.round(h.metrics.totalVolume)} kg`}
            />
            <MetricCard
              label={t('logSession.workRest', {
                work: h.metrics.workMinutes,
                rest: h.metrics.restMinutes,
              })}
              value={`${h.metrics.computedMinutes} min`}
            />
          </div>
        </section>

        {/* ── Delete (edit mode only) ── */}
        {h.isEditing && (
          <div className={styles.dangerZone}>
            <Button
              variant="error"
              appearance="ghost"
              size="sm"
              onClick={() => h.setDeleteConfirmOpen(true)}
            >
              {t('logSession.deleteThis')}
            </Button>
          </div>
        )}
      </div>

      {/* ── Dialogs ── */}
      <CalendarDialog
        open={h.calendarOpen}
        onClose={() => h.setCalendarOpen(false)}
        year={h.calendarViewYear}
        month={h.calendarViewMonth}
        selectedDate={h.selectedDate}
        daysInMonth={h.daysInMonth}
        firstDayIndex={h.firstDayIndex}
        onPrev={h.handlePrevMonth}
        onNext={h.handleNextMonth}
        onPick={h.handlePickCalendarDay}
      />

      <AddExerciseDialog
        open={h.addExerciseTarget !== null}
        onClose={() => h.setAddExerciseTarget(null)}
        onSelect={h.handleAddExerciseFromModal}
      />

      <ConfirmDialog
        open={h.deleteConfirmOpen}
        title={t('logSession.deleteTitle')}
        message={t('logSession.deleteBody')}
        confirmLabel={t('logSession.deleteConfirm')}
        onConfirm={h.handleDeleteSession}
        onCancel={() => h.setDeleteConfirmOpen(false)}
        destructive
      />

      <ConfirmDialog
        open={h.discardDialogOpen}
        title={t('logSession.discardTitle')}
        message={t('logSession.discardBody')}
        confirmLabel={t('logSession.discard')}
        cancelLabel={t('logSession.keepEditing')}
        onConfirm={() => router.back()}
        onCancel={() => h.setDiscardDialogOpen(false)}
      />
    </div>
  );
}

/* ─── Sub-components ─── */

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metricCard}>
      <Text variant="body" className={styles.metricValue}>{value}</Text>
      <Text variant="caption">{label}</Text>
    </div>
  );
}

interface CalendarDialogProps {
  open: boolean;
  onClose: () => void;
  year: number;
  month: number;
  selectedDate: Date;
  daysInMonth: number;
  firstDayIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onPick: (day: number) => void;
}

function CalendarDialog({
  open,
  onClose,
  year,
  month,
  selectedDate,
  daysInMonth,
  firstDayIndex,
  onPrev,
  onNext,
  onPick,
}: CalendarDialogProps) {
  if (!open) return null;

  const today = new Date();
  const isSelectedMonth =
    selectedDate.getFullYear() === year && selectedDate.getMonth() === month;
  const selectedDay = isSelectedMonth ? selectedDate.getDate() : -1;
  const isTodayMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDay = isTodayMonth ? today.getDate() : -1;

  const dayLetters = calendarDayLetters();
  const blanks = Array.from({ length: firstDayIndex }, (_, i) => (
    <span key={`blank-${i}`} />
  ));
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const isSel = day === selectedDay;
    const isTod = day === todayDay;
    return (
      <button
        key={day}
        className={`${styles.calendarDay} ${isSel ? styles.calendarDaySelected : ''} ${isTod && !isSel ? styles.calendarDayToday : ''}`}
        onClick={() => onPick(day)}
      >
        {day}
      </button>
    );
  });

  return (
    <div className={styles.calendarOverlay} onClick={onClose}>
      <div
        className={styles.calendarDialog}
        role="dialog"
        aria-label="Calendar"
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.calendarNav}>
          <IconButton
            icon={'chevron-left' as IconProps['name']}
            variant="neutral"
            appearance="ghost"
            size="sm"
            onClick={onPrev}
            label="Previous month"
          />
          <Text variant="h5">{calendarMonthLabel(month, year)}</Text>
          <IconButton
            icon={'chevron-right' as IconProps['name']}
            variant="neutral"
            appearance="ghost"
            size="sm"
            onClick={onNext}
            label="Next month"
          />
        </div>
        <div className={styles.calendarGrid}>
          {dayLetters.map((letter, i) => (
            <span key={`dl-${i}`} className={styles.calendarDayLabel}>
              {letter}
            </span>
          ))}
          {blanks}
          {days}
        </div>
      </div>
    </div>
  );
}

interface CircuitBlockProps {
  circuit: WorkoutCircuit;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  onSetBlockType: (bt: CircuitBlockType) => void;
  onUpdateField: (
    field: keyof WorkoutCircuit,
    val: WorkoutCircuit[keyof WorkoutCircuit],
  ) => void;
  onUpdateExercise: (
    exIdx: number,
    updates: Partial<PastWorkoutExerciseItem>,
  ) => void;
  onRemoveExercise: (exIdx: number) => void;
  onAddExercise: () => void;
  exercises: { id: string; name: string }[];
}

function CircuitBlock({
  circuit,
  index,
  canRemove,
  onRemove,
  onSetBlockType,
  onUpdateField,
  onUpdateExercise,
  onRemoveExercise,
  onAddExercise,
  exercises,
}: CircuitBlockProps) {
  const { t } = useTranslation();
  const amrap = isAmrap(circuit);
  const blockType = circuit.blockType ?? 'intervals';

  return (
    <Surface appearance="outlined" className={styles.circuitBlock}>
      <div className={styles.circuitHeader}>
        <Text variant="body">{t('common.circuitN', { n: index + 1 })}</Text>
        {canRemove && (
          <IconButton
            icon={'trash' as IconProps['name']}
            variant="error"
            appearance="ghost"
            size="sm"
            onClick={onRemove}
            label={t('common.delete')}
          />
        )}
      </div>

      {/* Block type toggle */}
      <div className={styles.blockTypeGroup}>
        <button
          className={`${styles.chip} ${blockType === 'intervals' ? styles.chipSelected : ''}`}
          onClick={() => onSetBlockType('intervals')}
        >
          {t('logSession.blockIntervals')}
        </button>
        <button
          className={`${styles.chip} ${blockType === 'amrap' ? styles.chipSelected : ''}`}
          onClick={() => onSetBlockType('amrap')}
        >
          {t('logSession.blockAmrap')}
        </button>
      </div>

      {/* Timing controls */}
      <div className={styles.circuitTimingRow}>
        {amrap ? (
          <div className={styles.circuitTimingField}>
            <Text variant="caption">{t('logSession.amrapTime')}</Text>
            <Stepper
              value={circuit.timeCapMinutes ?? DEFAULT_AMRAP_MINUTES}
              onChange={v => onUpdateField('timeCapMinutes', v)}
              min={1}
              max={60}
              format={v => `${v} min`}
              label={t('logSession.amrapTimeA11y')}
              size="sm"
            />
          </div>
        ) : (
          <>
            <div className={styles.circuitTimingField}>
              <Text variant="caption">{t('logSession.rounds')}</Text>
              <Stepper
                value={circuit.rounds || 3}
                onChange={v => onUpdateField('rounds', v)}
                min={1}
                max={50}
                label={t('logSession.roundsA11y')}
                size="sm"
              />
            </div>
            <div className={styles.circuitTimingField}>
              <Text variant="caption">{t('logSession.workSec')}</Text>
              <Stepper
                value={circuit.workSeconds || 30}
                onChange={v => onUpdateField('workSeconds', v)}
                min={5}
                max={300}
                step={5}
                format={v => `${v}s`}
                label={t('logSession.workA11y')}
                size="sm"
              />
            </div>
            <div className={styles.circuitTimingField}>
              <Text variant="caption">{t('logSession.restSec')}</Text>
              <Stepper
                value={circuit.restSeconds ?? 10}
                onChange={v => onUpdateField('restSeconds', v)}
                min={0}
                max={120}
                step={5}
                format={v => `${v}s`}
                label={t('logSession.restA11y')}
                size="sm"
              />
            </div>
          </>
        )}
      </div>

      {/* Rest between circuits */}
      <div className={styles.circuitTimingField}>
        <Text variant="caption">{t('logSession.restBetween')}</Text>
        <Stepper
          value={circuit.restBetweenCircuitsSeconds || 60}
          onChange={v => onUpdateField('restBetweenCircuitsSeconds', v)}
          min={0}
          max={300}
          step={10}
          format={v => `${v}s`}
          label={t('logSession.restBetween')}
          size="sm"
        />
      </div>

      {/* Circuit exercises */}
      <Text variant="caption">
        {t('logSession.circuitExercises', { n: circuit.exercises.length })}
      </Text>
      {circuit.exercises.length === 0 ? (
        <Text variant="body-sm" className={styles.emptyList}>
          {t('logSession.emptyCircuit')}
        </Text>
      ) : (
        circuit.exercises.map((item, exIdx) => (
          <ExerciseRow
            key={`c-${circuit.id}-${exIdx}`}
            item={item}
            exercises={exercises}
            onUpdate={updates => onUpdateExercise(exIdx, updates)}
            onRemove={() => onRemoveExercise(exIdx)}
          />
        ))
      )}

      <Button
        variant="neutral"
        appearance="outlined"
        size="sm"
        onClick={onAddExercise}
      >
        {t('logSession.addToCircuit', { name: circuit.name })}
      </Button>
    </Surface>
  );
}

interface ExerciseRowProps {
  item: PastWorkoutExerciseItem;
  exercises: { id: string; name: string }[];
  onUpdate: (updates: Partial<PastWorkoutExerciseItem>) => void;
  onRemove: () => void;
}

function ExerciseRow({ item, exercises, onUpdate, onRemove }: ExerciseRowProps) {
  const { t } = useTranslation();
  const found = exercises.find(e => e.id === item.exerciseId);
  const name = exName(item.exerciseId, found?.name ?? item.exerciseName ?? '');
  const showWeight = !isBodyweight(item.equipment);

  return (
    <div className={styles.exerciseRow}>
      <ExerciseItemHeader
        exerciseName={name}
        category={item.category}
        equipment={item.equipment ?? ''}
        actions={
          <IconButton
            icon={'x' as IconProps['name']}
            variant="neutral"
            appearance="ghost"
            size="sm"
            onClick={onRemove}
            label={t('common.delete')}
          />
        }
      />
      <div className={styles.exerciseFields}>
        {showWeight && (
          <WeightInput
            weightKg={item.weightKg ?? 0}
            onChange={kg => onUpdate({ weightKg: kg })}
            weightPerSide={item.weightPerSide}
            onPerSideChange={v => onUpdate({ weightPerSide: v })}
          />
        )}
        <div className={styles.fieldGroup}>
          <Text variant="caption">{t('logSession.repsCombo')}</Text>
          <input
            type="text"
            className={styles.fieldInput}
            value={item.repsDetail ?? ''}
            onChange={e => onUpdate({ repsDetail: e.target.value })}
            placeholder={t('logSession.repsPlaceholder')}
            inputMode="text"
          />
        </div>
        <div className={styles.fieldGroup}>
          <Text variant="caption">{t('logSession.time')}</Text>
          <input
            type="text"
            className={styles.fieldInput}
            value={item.timeString ?? ''}
            onChange={e => onUpdate({ timeString: e.target.value })}
            placeholder={t('logSession.timePlaceholder')}
            inputMode="text"
          />
        </div>
        <div className={styles.fieldGroup}>
          <Text variant="caption">{t('logSession.rounds')}</Text>
          <Stepper
            value={item.rounds || 3}
            onChange={v => onUpdate({ rounds: v })}
            min={1}
            max={50}
            label={t('logSession.roundsA11y')}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
