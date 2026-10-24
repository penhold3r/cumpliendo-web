export type MuscleGroup = string;

/** Built-in or custom equipment (translated by key when built-in). */
export type BuiltInEquipment = string;

/** Exercise equipment: either built-in or user-created free text. */
export type Equipment = string;

export type WorkoutType = string;

export type WodFormat = string;

export interface Exercise {
  id: string;
  name: string;
  /** Primary muscle group (first entry in `muscles`). Copied to routines and sessions. */
  category: MuscleGroup;
  /** All targeted muscle groups, primary first. If omitted, `category` is used. */
  muscles?: MuscleGroup[];
  equipment: Equipment;
  /** Suggested equipment alternatives shown first in picker when adding to workout. */
  suggestedEquipment?: Equipment[];
  defaultRestSeconds: number;
  description?: string;
  workoutTypes?: (WorkoutType | MuscleGroup | string)[];
}

/** Measured exercise unit: repetitions (default), meters, or calories. */
export type ExerciseMeasure = 'reps' | 'meters' | 'calories';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  previousWeightKg?: number;
  previousReps?: number;
  isWarmup?: boolean;
  timeString?: string;
  repsDetail?: string;
  workSeconds?: number;
  restSeconds?: number;
  /** `weightKg` is per hand (two dumbbells/kettlebells): load counts double in volume. */
  weightPerSide?: boolean;
  /** Distance covered (distance-measured exercises; `reps` stays 0). */
  distanceMeters?: number;
  /** Ergometer calories (calorie-measured exercises; `reps` stays 0). */
  calories?: number;
}

export interface ExerciseInWorkout {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: MuscleGroup;
  equipment: Equipment;
  sets: WorkoutSet[];
  notes?: string;
  circuitId?: string;
  circuitName?: string;
  /** Recorded measure (absent = repetitions). */
  measure?: ExerciseMeasure;
  /** Ladder: increment/decrement step per round. */
  repsIncrement?: number;
  /** Plan from the routine this workout was started from (ranges, failure, superset, cue). */
  target?: ExerciseTarget;
}

/**
 * How a routine prescribes an exercise beyond fixed sets × reps. `defaultSets` / `defaultReps`
 * are the lower bounds of a range; everything here is optional, so older routines are unchanged.
 */
export interface ExerciseTargetOptions {
  /** Upper bound when sets are a range ("2–3"). */
  setsMax?: number;
  /** Upper bound when reps are a range ("8–10"). */
  repsMax?: number;
  /** Reps to failure: there is no rep number (`defaultReps` is ignored). */
  toFailure?: boolean;
  /** Reps are counted per leg/arm. */
  perSide?: boolean;
  /** Consecutive exercises sharing this id are performed as a superset. */
  supersetId?: string;
  /** Coaching cue from the plan ("4 warm-up sets"): an instruction, not logged data. */
  cue?: string;
}

export interface RoutineExerciseTemplate extends ExerciseTargetOptions {
  exerciseId: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeightKg: number;
  equipment?: Equipment;
  category?: MuscleGroup;
}

/** A routine exercise's plan, carried into a live workout to show what to aim for. */
export interface ExerciseTarget extends ExerciseTargetOptions {
  sets: number;
  reps: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedMinutes: number;
  exercises: RoutineExerciseTemplate[];
  /** Warmup minutes at beginning (0 or absent = no block). */
  warmupMinutes?: number;
  /** Cooldown minutes at end (0 or absent = no block). */
  cooldownMinutes?: number;
  createdAt: string;
}

export type CircuitBlockType = 'intervals' | 'amrap';

export interface WorkoutCircuit {
  id: string;
  name: string;
  /**
   * 'intervals' (or absent): work/rest time per station × rounds.
   * 'amrap': fixed duration block (`timeCapMinutes`) without pauses; `rounds` are completed rounds.
   */
  blockType?: CircuitBlockType;
  /** AMRAP block duration in minutes. */
  timeCapMinutes?: number;
  rounds: number;
  workSeconds: number;
  restSeconds: number;
  restBetweenCircuitsSeconds?: number;
  exercises: PastWorkoutExerciseItem[];
}

export interface WorkoutSession {
  id: string;
  routineId?: string;
  routineName: string;
  workoutType?: WorkoutType;
  wodFormat?: WodFormat;
  scoreOrRounds?: string; // e.g. "12:45", "5 Rounds + 15 Burpees", "3 Rounds"
  caloriesBurned?: number;
  startedAt: string; // ISO string
  finishedAt?: string; // ISO string
  durationSeconds: number;
  totalVolumeKg: number;
  totalWorkSeconds?: number;
  totalRestSeconds?: number;
  completedSets: number;
  totalSets: number;
  exercises: ExerciseInWorkout[];
  circuits?: WorkoutCircuit[];
  /** Warmup minutes at beginning (0 or absent = no block). */
  warmupMinutes?: number;
  /** Cooldown minutes at end (0 or absent = no block). */
  cooldownMinutes?: number;
  notes?: string;
}

export interface PastWorkoutExerciseItem {
  exerciseId: string;
  exerciseName: string;
  category: MuscleGroup;
  equipment: Equipment;
  weightKg?: number;
  reps?: number;
  repsDetail?: string;
  timeString?: string;
  workSeconds?: number;
  restSeconds?: number;
  rounds?: number;
  circuitId?: string;
  circuitName?: string;
  /** Quantity measurement (`reps`/`repsDetail`): repetitions (default), meters, or calories. */
  measure?: ExerciseMeasure;
  /** Ladder: quantity increment/decrement per round, e.g. 5, 10, 15. */
  repsIncrement?: number;
  /** Weight is per hand (two dumbbells/kettlebells): counts double in total volume. */
  weightPerSide?: boolean;
}

export type DateOption = 'today' | 'yesterday' | 'custom';

export interface LogPastWorkoutInput {
  editSessionId?: string;
  name?: string;
  workoutType: WorkoutType;
  wodFormat?: WodFormat;
  durationMinutes: number;
  date?: string; // ISO date string for any selected date
  dateOption?: DateOption;
  customDate?: string;
  customExercises?: PastWorkoutExerciseItem[];
  circuits?: WorkoutCircuit[];
  selectedExercises?: Exercise[];
  scoreOrRounds?: string;
  /** Warmup minutes at beginning (0 or absent = no block). */
  warmupMinutes?: number;
  /** Cooldown minutes at end (0 or absent = no block). */
  cooldownMinutes?: number;
  notes?: string;
}

export interface UserStats {
  currentStreak: number;
  bestStreak: number;
  weeklyGoalDays: number;
  completedThisWeek: number;
  totalWorkouts: number;
  totalVolumeKg: number;
  lastWorkoutDate: string | null;
  targetWeekdays?: number[];
}

export interface UserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt?: string;
  lastLoginAt?: string;
}

export type TabType = 'home' | 'active' | 'routines' | 'history' | 'exercises';
