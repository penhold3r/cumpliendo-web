import i18n from './i18n';
import { DEFAULT_STARTER_ROUTINES } from '../data/routines';
import { type ExerciseMeasure, type ExerciseTarget } from '../types';

/**
 * Domain values are stored in Spanish ('Pecho', 'Barra', 'Funcional') as stable keys
 * in AsyncStorage and Firestore. These helpers translate them strictly for UI display; an unknown
 * value (e.g. user-created free text) is displayed as-is.
 */
const lookup = (group: string, value: string | undefined): string =>
  value ? i18n.t(`${group}.${value}`, { defaultValue: value }) : '';

export const muscleLabel = (value?: string) => lookup('domain.muscle', value);
/** Muscle group list: "Legs, Glutes" / "Piernas, Glúteos". */
export const musclesLabel = (values: readonly string[]) =>
  values.map(muscleLabel).filter(Boolean).join(', ');
export const equipmentLabel = (value?: string) =>
  lookup('domain.equipment', value);
export const workoutTypeLabel = (value?: string) =>
  lookup('domain.workoutType', value);
export const wodFormatLabel = (value?: string) =>
  lookup('domain.wodFormat', value);
export const routineCategoryLabel = (value?: string) =>
  lookup('domain.routineCategory', value);

/** Exercise name: built-in exercises are translated by id; user-created exercises are not. */
export const exerciseName = (
  exerciseId: string | undefined,
  storedName: string,
): string =>
  exerciseId
    ? i18n.t(`exercises.${exerciseId}`, { defaultValue: storedName })
    : storedName;

/**
 * Starter routines: translated by id only while they match the original starter text.
 * If user edited name or description, user's custom text is preserved as typed.
 */
export const routineText = (
  routineId: string | undefined,
  field: 'name' | 'description',
  stored: string,
): string => {
  const seed = DEFAULT_STARTER_ROUTINES.find(r => r.id === routineId);
  return seed && seed[field] === stored
    ? i18n.t(`routines.${seed.id}.${field}`, { defaultValue: stored })
    : stored;
};

/** App-generated "Circuit 3" / "Circuito 3" → localized; custom names typed by user remain unchanged. */
export const circuitName = (stored: string): string => {
  const m = /^(?:Circuito|Circuit) (\d+)$/i.exec(stored.trim());
  return m ? i18n.t('common.circuitN', { n: m[1] }) : stored;
};

const shortDate = (iso: string, tag: string) =>
  new Date(iso).toLocaleDateString(tag, { day: 'numeric', month: 'short' });

interface TitledSession {
  routineId?: string;
  routineName: string;
  workoutType?: string;
  wodFormat?: string;
  startedAt: string;
}

/**
 * Workout session title. Rebuilt in active locale when stored matches generated title;
 * user-typed title is shown as typed.
 */
export const sessionTitle = (session: TitledSession): string => {
  const stored = session.routineName;
  if (stored === 'Entrenamiento Libre' || stored === 'Free Workout') {
    return i18n.t('common.freeWorkout');
  }
  if (session.workoutType) {
    const fmt = (type: string, format: string | undefined, date: string) =>
      `${type}${format ? ` (${format})` : ''} • ${date}`;
    const generatedEs = fmt(
      session.workoutType,
      session.wodFormat,
      shortDate(session.startedAt, 'es-ES'),
    );
    const generatedEn = fmt(
      session.workoutType,
      session.wodFormat,
      shortDate(session.startedAt, 'en-US'),
    );
    const generatedLocalized = fmt(
      workoutTypeLabel(session.workoutType),
      session.wodFormat ? wodFormatLabel(session.wodFormat) : undefined,
      shortDate(session.startedAt, i18n.language === 'en' ? 'en-US' : 'es-ES'),
    );
    if (
      stored === generatedEs ||
      stored === generatedEn ||
      stored === generatedLocalized
    ) {
      return generatedLocalized;
    }
  }
  return routineText(session.routineId, 'name', stored);
};

/** Saved summary "2 Circuits • 3 Rounds (30s × 10s)" / "2 Circuitos • 3 Vueltas (30s × 10s)" → in active language. */
export const scoreOrRoundsLabel = (stored: string): string => {
  const m =
    /^(\d+) (?:Circuitos?|Circuits?) • (\d+) (?:Vueltas|Rounds) \((\d+)s × (\d+)s\)$/i.exec(
      stored,
    );
  if (!m) return stored;
  const [, circuits = '0', rounds = '0', work, rest] = m;
  return i18n.t('history.circuitSummary', {
    circuits:
      Number(circuits) === 1
        ? i18n.t('common.circuitOne')
        : i18n.t('common.circuitMany', { n: circuits }),
    rounds: i18n.t('common.roundsN', { n: rounds }),
    work,
    rest,
  });
};

/** Quantity with unit: "12 reps", "20 m", "15 cal"; ladders display as "5-10-15 reps". */
export const measureAmountLabel = (
  measure: ExerciseMeasure,
  amounts: number | number[],
): string => {
  const n = Array.isArray(amounts) ? amounts.join('-') : String(amounts);
  return measure === 'meters'
    ? i18n.t('history.meters', { n })
    : measure === 'calories'
    ? i18n.t('history.calories', { n })
    : i18n.t('history.reps', { n });
};

/**
 * A planned target as shown in routines and live workouts: "4 × 4–6", "2–3 × 10 / side",
 * "3 × to failure". The lower bounds are `sets`/`reps`; ranges use their `…Max`.
 */
export const targetLabel = (
  target: Pick<
    ExerciseTarget,
    'sets' | 'reps' | 'setsMax' | 'repsMax' | 'toFailure' | 'perSide'
  >,
): string => {
  const range = (min: number, max?: number) =>
    max && max > min ? `${min}–${max}` : String(min);
  const sets = range(target.sets, target.setsMax);
  if (target.toFailure) {
    return i18n.t('target.setsToFailure', { sets });
  }
  const reps = range(target.reps, target.repsMax);
  return i18n.t(target.perSide ? 'target.setsRepsPerSide' : 'target.setsReps', {
    sets,
    reps,
  });
};
