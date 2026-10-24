import { type WorkoutSession, type UserStats } from '../types';

export const EMPTY_STATS: UserStats = {
  currentStreak: 0,
  bestStreak: 0,
  weeklyGoalDays: 0,
  completedThisWeek: 0,
  totalWorkouts: 0,
  totalVolumeKg: 0,
  lastWorkoutDate: null,
  targetWeekdays: [],
};

export const EMPTY_HISTORY: WorkoutSession[] = [];

export const MOCK_STATS: UserStats = {
  currentStreak: 4,
  bestStreak: 12,
  weeklyGoalDays: 4,
  completedThisWeek: 3,
  totalWorkouts: 28,
  totalVolumeKg: 142500,
  lastWorkoutDate: new Date(Date.now() - 86400000).toISOString(),
  targetWeekdays: [0, 1, 3, 4],
};

export const INITIAL_STATS: UserStats = EMPTY_STATS;

export const MOCK_HISTORY: WorkoutSession[] = [
  {
    id: 'history-1',
    routineId: 'routine-push-pull',
    routineName: 'Torso - Fuerza & Hipertrofia',
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    finishedAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    durationSeconds: 3480, // 58 min
    totalVolumeKg: 8420,
    completedSets: 18,
    totalSets: 18,
    exercises: [
      {
        id: 'hist-ex-1',
        exerciseId: 'ex-pecho-1',
        exerciseName: 'Press de Banca Plano con Barra',
        category: 'chest',
        equipment: 'barbell',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 60, reps: 10, completed: true },
          { id: 's2', setNumber: 2, weightKg: 70, reps: 8, completed: true },
          { id: 's3', setNumber: 3, weightKg: 75, reps: 8, completed: true },
          { id: 's4', setNumber: 4, weightKg: 80, reps: 6, completed: true },
        ],
      },
      {
        id: 'hist-ex-2',
        exerciseId: 'ex-espalda-2',
        exerciseName: 'Remo con Barra Pendlay / 45°',
        category: 'back',
        equipment: 'barbell',
        sets: [
          { id: 's5', setNumber: 1, weightKg: 60, reps: 10, completed: true },
          { id: 's6', setNumber: 2, weightKg: 65, reps: 8, completed: true },
          { id: 's7', setNumber: 3, weightKg: 70, reps: 8, completed: true },
        ],
      },
    ],
    notes: 'Excelente sensación en press banca, subí 2.5kg en la última serie.',
  },
  {
    id: 'history-2',
    routineId: 'routine-legs-core',
    routineName: 'Pierna Completa & Core',
    startedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    finishedAt: new Date(Date.now() - 86400000 * 3 + 3720000).toISOString(),
    durationSeconds: 3720, // 62 min
    totalVolumeKg: 11200,
    completedSets: 17,
    totalSets: 17,
    exercises: [
      {
        id: 'hist-ex-3',
        exerciseId: 'ex-piernas-1',
        exerciseName: 'Sentadilla Libre con Barra (Squat)',
        category: 'legs',
        equipment: 'barbell',
        sets: [
          { id: 's8', setNumber: 1, weightKg: 80, reps: 10, completed: true },
          { id: 's9', setNumber: 2, weightKg: 95, reps: 8, completed: true },
          { id: 's10', setNumber: 3, weightKg: 100, reps: 6, completed: true },
        ],
      },
    ],
    notes: 'Piernas temblando. Cumplido con todo el volumen programado.',
  },
];

export const INITIAL_HISTORY: WorkoutSession[] = EMPTY_HISTORY;
