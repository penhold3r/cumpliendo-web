'use client';

import { useState } from 'react';
import {
  Button,
  IconButton,
  Surface,
  Text,
  type IconButtonProps,
} from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import { useUnits } from '@/context/SettingsContext/useUnits.hook';
import { useRoutineEditor } from './useRoutineEditor.hook';
import {
  ROUTINE_CATEGORIES,
  ESTIMATED_DURATION_PRESETS,
  type RoutineEditorProps,
  type RoutineExerciseItem,
} from './RoutineEditor.types';
import { Stepper } from '../../ui/Stepper';
import { SessionBlockRow } from '../../ui/SessionBlockRow';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { AddExerciseDialog } from '../../ui/AddExerciseDialog';
import { ExerciseItemHeader } from '../../ui/ExerciseItemHeader';
import styles from './RoutineEditor.module.css';

export function RoutineEditor(props: RoutineEditorProps) {
  const { t } = useTranslation();
  const { unitLabel, toDisplay, fromDisplay } = useUnits();

  const editor = useRoutineEditor(props);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <IconButton
          icon={'arrow-left' as IconButtonProps['icon']}
          appearance="ghost"
          size="sm"
          label={t('common.back')}
          onClick={editor.handleBack}
        />
        <Text as="h1" variant="h4" className={styles.headerTitle}>
          {editor.isEditing
            ? t('routineEditor.editTitle')
            : t('routineEditor.newTitle')}
        </Text>
        <Button
          variant="primary"
          size="sm"
          disabled={!editor.canSave}
          onClick={editor.handleSave}
        >
          {editor.isEditing
            ? t('routineEditor.saveChanges')
            : t('routineEditor.saveNew')}
        </Button>
      </header>

      <div className={styles.body}>
        {/* Details Section */}
        <section className={styles.section}>
          <Text variant="overline" className={styles.sectionLabel}>
            {t('routineEditor.details')}
          </Text>

          <div className={styles.fieldGroup}>
            <input
              className={styles.input}
              type="text"
              value={editor.name}
              onChange={e => editor.setName(e.target.value)}
              placeholder={t('routineEditor.namePlaceholder')}
              aria-label={t('routineEditor.nameLabel')}
            />
          </div>

          <div className={styles.fieldGroup}>
            <textarea
              className={styles.textarea}
              value={editor.description}
              onChange={e => editor.setDescription(e.target.value)}
              placeholder={t('routineEditor.descPlaceholder')}
              aria-label={t('routineEditor.descLabel')}
              rows={2}
            />
          </div>
        </section>

        {/* Category */}
        <section className={styles.section}>
          <Text variant="overline" className={styles.sectionLabel}>
            {t('routineEditor.category')}
          </Text>
          <div className={styles.chipGroup}>
            {ROUTINE_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.chip} ${editor.category === cat ? styles.chipSelected : ''}`}
                onClick={() => editor.setCategory(cat)}
              >
                {t(`domain.routineCategory.${cat}`)}
              </button>
            ))}
          </div>
        </section>

        {/* Duration */}
        <section className={styles.section}>
          <Text variant="overline" className={styles.sectionLabel}>
            {t('routineEditor.durationN', { n: editor.estimatedMinutes })}
          </Text>
          <div className={styles.durationRow}>
            <div className={styles.chipGroup}>
              {ESTIMATED_DURATION_PRESETS.map(preset => (
                <button
                  key={preset}
                  className={`${styles.chip} ${editor.estimatedMinutes === preset ? styles.chipSelected : ''}`}
                  onClick={() => editor.setEstimatedMinutes(preset)}
                >
                  {preset} {t('common.min')}
                </button>
              ))}
            </div>
            <Stepper
              value={editor.estimatedMinutes}
              onChange={editor.setEstimatedMinutes}
              min={5}
              max={180}
              step={5}
              format={v => `${v}`}
              label={t('routineEditor.durationA11y')}
              size="sm"
            />
          </div>
          {editor.suggestedMinutes !== null &&
            editor.suggestedMinutes !== editor.estimatedMinutes && (
              <Text
                variant="caption"
                className={styles.suggestedHint}
                onClick={() =>
                  editor.setEstimatedMinutes(editor.suggestedMinutes!)
                }
              >
                {t('routineEditor.useEstimate', {
                  n: editor.suggestedMinutes,
                })}
              </Text>
            )}
        </section>

        {/* Warmup / Cooldown */}
        <section className={styles.section}>
          <SessionBlockRow
            type="warmup"
            minutes={editor.warmupMinutes}
            onChange={editor.setWarmupMinutes}
          />
          <SessionBlockRow
            type="cooldown"
            minutes={editor.cooldownMinutes}
            onChange={editor.setCooldownMinutes}
          />
        </section>

        {/* Exercises */}
        <section className={styles.section}>
          <Text variant="overline" className={styles.sectionLabel}>
            {t('routineEditor.exercisesN', {
              n: editor.exercisesList.length,
            })}
          </Text>
          <Text variant="caption" className={styles.sectionLabel}>
            {t('routineEditor.exercisesHint')}
          </Text>

          {editor.exercisesList.length === 0 ? (
            <div className={styles.emptyExercises}>
              <Text variant="body-sm" className={styles.emptyText}>
                {t('routineEditor.emptyBody')}
              </Text>
            </div>
          ) : (
            <div className={styles.exerciseList}>
              {editor.exercisesList.map((item, index) => (
                <ExerciseRow
                  key={`${item.exerciseId}-${index}`}
                  item={item}
                  index={index}
                  total={editor.exercisesList.length}
                  onUpdate={editor.handleUpdateExercise}
                  onRemove={editor.handleRemoveExercise}
                  onMoveUp={() => editor.handleMoveExercise(index, 'up')}
                  onMoveDown={() => editor.handleMoveExercise(index, 'down')}
                  onToggleSuperset={() => editor.handleToggleSuperset(index)}
                  unitLabel={unitLabel}
                  toDisplay={toDisplay}
                  fromDisplay={fromDisplay}
                  t={t}
                />
              ))}
            </div>
          )}

          <Button
            variant="primary"
            appearance="outlined"
            size="md"
            fullWidth
            onClick={() => editor.setAddExerciseDialogOpen(true)}
          >
            {t('routineEditor.addExercise')}
          </Button>
        </section>

        {/* Delete (editing only) */}
        {editor.isEditing && (
          <div className={styles.footer}>
            <Button
              variant="error"
              appearance="ghost"
              size="sm"
              onClick={() => editor.setDeleteConfirmOpen(true)}
            >
              {t('routineEditor.deleteThis')}
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddExerciseDialog
        open={editor.addExerciseDialogOpen}
        onClose={() => editor.setAddExerciseDialogOpen(false)}
        onSelect={editor.handleAddExercise}
      />

      <ConfirmDialog
        open={editor.discardDialogOpen}
        title={t('routineEditor.discardTitle')}
        message={t('routineEditor.discardBody')}
        confirmLabel={t('routineEditor.discard')}
        cancelLabel={t('routineEditor.keepEditing')}
        onConfirm={props.onBack}
        onCancel={() => editor.setDiscardDialogOpen(false)}
      />

      {editor.isEditing && (
        <ConfirmDialog
          open={editor.deleteConfirmOpen}
          title={t('confirmDelete.routineTitle')}
          message={`${t('confirmDelete.before')}${editor.name || t('confirmDelete.selected')}${t('confirmDelete.after')}`}
          onConfirm={editor.handleDelete}
          onCancel={() => editor.setDeleteConfirmOpen(false)}
          destructive
        />
      )}
    </div>
  );
}

/* ─── Exercise Row ─────────────────────────────────────────────── */

interface ExerciseRowProps {
  item: RoutineExerciseItem;
  index: number;
  total: number;
  onUpdate: (index: number, updates: Partial<RoutineExerciseItem>) => void;
  onRemove: (index: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleSuperset: () => void;
  unitLabel: string;
  toDisplay: (kg: number) => number;
  fromDisplay: (v: number) => number;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

function ExerciseRow({
  item,
  index,
  total,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onToggleSuperset,
  unitLabel,
  toDisplay,
  fromDisplay,
  t,
}: ExerciseRowProps) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const hasOptions =
    item.toFailure || item.perSide || item.supersetId || item.cue;

  return (
    <Surface appearance="outlined" className={styles.exerciseCard}>
      <ExerciseItemHeader
        exerciseName={item.name}
        category={item.category}
        equipment={item.equipment}
        actions={
          <div className={styles.exerciseActions}>
            <IconButton
              icon={'chevron-up' as IconButtonProps['icon']}
              appearance="ghost"
              size="sm"
              label={t('routineEditor.moveUp')}
              onClick={onMoveUp}
              disabled={index === 0}
            />
            <IconButton
              icon={'chevron-down' as IconButtonProps['icon']}
              appearance="ghost"
              size="sm"
              label={t('routineEditor.moveDown')}
              onClick={onMoveDown}
              disabled={index === total - 1}
            />
            <IconButton
              icon={'x' as IconButtonProps['icon']}
              appearance="ghost"
              variant="error"
              size="sm"
              label={t('routineEditor.remove')}
              onClick={() => onRemove(index)}
            />
          </div>
        }
      />

      {item.supersetId && (
        <span className={styles.supersetBadge}>
          {t('routineEditor.superset')}
        </span>
      )}

      {/* Sets / Reps / Weight */}
      <div className={styles.exerciseFields}>
        <div className={styles.fieldCell}>
          <Text variant="caption" className={styles.fieldLabel}>
            {t('routineEditor.sets')}
          </Text>
          <Stepper
            value={item.defaultSets}
            onChange={v => onUpdate(index, { defaultSets: v })}
            min={1}
            max={20}
            label={t('routineEditor.setsFor', { name: item.name })}
            size="sm"
          />
        </div>
        <div className={styles.fieldCell}>
          <Text variant="caption" className={styles.fieldLabel}>
            {t('routineEditor.reps')}
          </Text>
          <Stepper
            value={item.defaultReps}
            onChange={v => onUpdate(index, { defaultReps: v })}
            min={1}
            max={100}
            label={t('routineEditor.repsFor', { name: item.name })}
            size="sm"
          />
        </div>
        <div className={styles.fieldCell}>
          <Text variant="caption" className={styles.fieldLabel}>
            {unitLabel}
          </Text>
          <Stepper
            value={toDisplay(item.defaultWeightKg)}
            onChange={v => onUpdate(index, { defaultWeightKg: fromDisplay(v) })}
            min={0}
            max={500}
            step={2.5}
            format={v => (v > 0 ? String(v) : '—')}
            label={`Weight for ${item.name}`}
            size="sm"
          />
        </div>
      </div>

      {/* Options toggle */}
      <button
        className={styles.optionsToggle}
        onClick={() => setOptionsOpen(o => !o)}
      >
        {optionsOpen
          ? '▾ ' + t('routineEditor.moreOptions')
          : '▸ ' + t('routineEditor.moreOptions')}
        {!optionsOpen && hasOptions ? ' ✱' : ''}
      </button>

      {optionsOpen && (
        <div className={styles.optionsPanel}>
          {/* Range (sets) */}
          <div className={styles.optionRow}>
            <Text variant="body-sm">{t('routineEditor.range')}</Text>
          </div>
          <div className={styles.exerciseFields}>
            <div className={styles.fieldCell}>
              <Text variant="caption" className={styles.fieldLabel}>
                {t('routineEditor.setsMin')}
              </Text>
              <Stepper
                value={item.defaultSets}
                onChange={v =>
                  onUpdate(index, {
                    defaultSets: v,
                    setsMax:
                      item.setsMax && item.setsMax < v ? v : item.setsMax,
                  })
                }
                min={1}
                max={20}
                size="sm"
              />
            </div>
            <div className={styles.fieldCell}>
              <Text variant="caption" className={styles.fieldLabel}>
                {t('routineEditor.upTo')}
              </Text>
              <Stepper
                value={item.setsMax ?? item.defaultSets}
                onChange={v => onUpdate(index, { setsMax: v })}
                min={item.defaultSets}
                max={20}
                label={t('routineEditor.setsMaxFor', { name: item.name })}
                size="sm"
              />
            </div>
          </div>

          {/* Range (reps) — only if not toFailure */}
          {!item.toFailure && (
            <div className={styles.exerciseFields}>
              <div className={styles.fieldCell}>
                <Text variant="caption" className={styles.fieldLabel}>
                  {t('routineEditor.repsMin')}
                </Text>
                <Stepper
                  value={item.defaultReps}
                  onChange={v =>
                    onUpdate(index, {
                      defaultReps: v,
                      repsMax:
                        item.repsMax && item.repsMax < v ? v : item.repsMax,
                    })
                  }
                  min={1}
                  max={100}
                  size="sm"
                />
              </div>
              <div className={styles.fieldCell}>
                <Text variant="caption" className={styles.fieldLabel}>
                  {t('routineEditor.upTo')}
                </Text>
                <Stepper
                  value={item.repsMax ?? item.defaultReps}
                  onChange={v => onUpdate(index, { repsMax: v })}
                  min={item.defaultReps}
                  max={100}
                  label={t('routineEditor.repsMaxFor', { name: item.name })}
                  size="sm"
                />
              </div>
            </div>
          )}

          {/* To failure */}
          <label className={styles.optionRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={!!item.toFailure}
              onChange={e =>
                onUpdate(index, { toFailure: e.target.checked || undefined })
              }
            />
            <Text variant="body-sm">{t('routineEditor.toFailure')}</Text>
          </label>

          {/* Per side */}
          <label className={styles.optionRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={!!item.perSide}
              onChange={e =>
                onUpdate(index, { perSide: e.target.checked || undefined })
              }
            />
            <Text variant="body-sm">{t('routineEditor.perSide')}</Text>
          </label>

          {/* Superset */}
          {index < total - 1 && (
            <label className={styles.optionRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={!!item.supersetId}
                onChange={onToggleSuperset}
              />
              <Text variant="body-sm">
                {item.supersetId
                  ? t('routineEditor.supersetUnlink')
                  : t('routineEditor.supersetLink')}
              </Text>
            </label>
          )}

          {/* Cue */}
          <input
            className={styles.cueInput}
            type="text"
            value={item.cue ?? ''}
            onChange={e => onUpdate(index, { cue: e.target.value })}
            placeholder={t('routineEditor.cueLabel')}
            aria-label={t('routineEditor.cueLabel')}
          />
        </div>
      )}
    </Surface>
  );
}
