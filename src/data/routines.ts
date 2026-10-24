import { type Routine } from '../types';

export const DEFAULT_STARTER_ROUTINES: Routine[] = [
  {
    id: 'routine-push-pull',
    name: 'Torso - Fuerza & Hipertrofia',
    description: 'Enfoque balanceado en pectoral, espalda y deltoides.',
    category: 'strength',
    estimatedMinutes: 55,
    createdAt: new Date().toISOString(),
    exercises: [
      {
        exerciseId: 'ex-pecho-1',
        defaultSets: 4,
        defaultReps: 8,
        defaultWeightKg: 70,
      },
      {
        exerciseId: 'ex-espalda-2',
        defaultSets: 4,
        defaultReps: 8,
        defaultWeightKg: 65,
      },
      {
        exerciseId: 'ex-pecho-2',
        defaultSets: 3,
        defaultReps: 10,
        defaultWeightKg: 24,
      },
      {
        exerciseId: 'ex-espalda-3',
        defaultSets: 3,
        defaultReps: 12,
        defaultWeightKg: 55,
      },
      {
        exerciseId: 'ex-hombros-2',
        defaultSets: 4,
        defaultReps: 15,
        defaultWeightKg: 10,
      },
    ],
  },
  {
    id: 'routine-legs-core',
    name: 'Pierna Completa & Core',
    description: 'Día pesado de cuádriceps, isquiotibiales y estabilidad.',
    category: 'hypertrophy',
    estimatedMinutes: 60,
    createdAt: new Date().toISOString(),
    exercises: [
      {
        exerciseId: 'ex-piernas-1',
        defaultSets: 4,
        defaultReps: 8,
        defaultWeightKg: 90,
      },
      {
        exerciseId: 'ex-piernas-2',
        defaultSets: 3,
        defaultReps: 12,
        defaultWeightKg: 160,
      },
      {
        exerciseId: 'ex-piernas-3',
        defaultSets: 4,
        defaultReps: 10,
        defaultWeightKg: 26,
      },
      {
        exerciseId: 'ex-piernas-4',
        defaultSets: 3,
        defaultReps: 15,
        defaultWeightKg: 45,
      },
      {
        exerciseId: 'ex-core-1',
        defaultSets: 3,
        defaultReps: 12,
        defaultWeightKg: 0,
      },
    ],
  },
  {
    id: 'routine-arms-shoulders',
    name: 'Brazos & Hombros (Pump Day)',
    description:
      'Bíceps, tríceps y deltoides lateral/posterior con gran congestión.',
    category: 'hypertrophy',
    estimatedMinutes: 45,
    createdAt: new Date().toISOString(),
    exercises: [
      {
        exerciseId: 'ex-hombros-1',
        defaultSets: 4,
        defaultReps: 10,
        defaultWeightKg: 20,
      },
      {
        exerciseId: 'ex-brazos-1',
        defaultSets: 3,
        defaultReps: 10,
        defaultWeightKg: 30,
      },
      {
        exerciseId: 'ex-brazos-3',
        defaultSets: 3,
        defaultReps: 12,
        defaultWeightKg: 25,
      },
      {
        exerciseId: 'ex-brazos-2',
        defaultSets: 3,
        defaultReps: 12,
        defaultWeightKg: 14,
      },
      {
        exerciseId: 'ex-hombros-2',
        defaultSets: 4,
        defaultReps: 15,
        defaultWeightKg: 10,
      },
    ],
  },
];

export const INITIAL_ROUTINES: Routine[] = [];
