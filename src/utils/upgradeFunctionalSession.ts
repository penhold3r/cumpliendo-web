import {
  type WorkoutSession,
  type WorkoutCircuit,
  type ExerciseInWorkout,
  type WorkoutSet,
  type PastWorkoutExerciseItem,
} from '../types';

export const upgradeLegacyFunctionalSession = (
  session: WorkoutSession,
): WorkoutSession => {
  // Only target the functional session from October 1st if it hasn't been upgraded to 2 circuits yet
  if (
    !session.routineName.toLowerCase().includes('funcional') ||
    (session.circuits && session.circuits.length >= 2)
  ) {
    return session;
  }

  const circuit1Exercises: PastWorkoutExerciseItem[] = [
    {
      exerciseId: 'ex-func-remo',
      exerciseName: 'Remo en Máquina / Ergómetro',
      category: 'functional',
      equipment: 'rowing_machine',
      circuitId: 'c-1',
      circuitName: 'Circuito 1',
      workSeconds: 30,
      restSeconds: 10,
      timeString: '30s',
      weightKg: 0,
      reps: 0,
      rounds: 3,
    },
    {
      exerciseId: 'ex-cross-2',
      exerciseName: 'Wall Balls (Tiro al Blanco con Balón)',
      category: 'crossfit',
      equipment: 'medicine_ball',
      circuitId: 'c-1',
      circuitName: 'Circuito 1',
      workSeconds: 30,
      restSeconds: 10,
      timeString: '30s',
      weightKg: 8,
      reps: 9,
      rounds: 3,
    },
    {
      exerciseId: 'ex-func-skip-bag',
      exerciseName: 'Skipping con Step y Bolsa de Carga',
      category: 'functional',
      equipment: 'plyo_box',
      circuitId: 'c-1',
      circuitName: 'Circuito 1',
      workSeconds: 30,
      restSeconds: 10,
      timeString: '30s',
      weightKg: 10,
      reps: 9,
      rounds: 3,
    },
    {
      exerciseId: 'ex-func-skip-aros',
      exerciseName: 'Skipping Coordinativo (Aros / Piso)',
      category: 'functional',
      equipment: 'none',
      circuitId: 'c-1',
      circuitName: 'Circuito 1',
      workSeconds: 30,
      restSeconds: 10,
      timeString: '30s',
      weightKg: 0,
      reps: 0,
      rounds: 3,
    },
    {
      exerciseId: 'ex-func-skip-press',
      exerciseName: 'Skipping con Press de Hombros',
      category: 'functional',
      equipment: 'dumbbells',
      circuitId: 'c-1',
      circuitName: 'Circuito 1',
      workSeconds: 30,
      restSeconds: 10,
      timeString: '30s',
      weightKg: 10,
      reps: 9,
      rounds: 3,
    },
  ];

  const circuit2Exercises: PastWorkoutExerciseItem[] = [
    {
      exerciseId: 'ex-func-combo-remo-curl',
      exerciseName: 'Remo y Curls con Barra (Combo)',
      category: 'functional',
      equipment: 'barbell',
      circuitId: 'c-2',
      circuitName: 'Circuito 2',
      workSeconds: 30,
      restSeconds: 10,
      timeString: '30s',
      weightKg: 30,
      reps: 5,
      repsDetail: '3 remos x 2 curls',
      rounds: 3,
    },
    {
      exerciseId: 'ex-func-abwheel',
      exerciseName: 'Ab Wheel (Rueda Abdominal)',
      category: 'core',
      equipment: 'none',
      circuitId: 'c-2',
      circuitName: 'Circuito 2',
      workSeconds: 30,
      restSeconds: 10,
      timeString: '30s',
      weightKg: 0,
      reps: 0,
      rounds: 3,
    },
    {
      exerciseId: 'ex-func-deadlift-bar',
      exerciseName: 'Peso Muerto con Barra (Deadlift)',
      category: 'legs',
      equipment: 'barbell',
      circuitId: 'c-2',
      circuitName: 'Circuito 2',
      workSeconds: 30,
      restSeconds: 10,
      timeString: '30s',
      weightKg: 45,
      reps: 9,
      rounds: 3,
    },
    {
      exerciseId: 'ex-func-skip-cajon',
      exerciseName: 'Skipping sobre Cajón (Paso Alterno)',
      category: 'functional',
      equipment: 'plyo_box',
      circuitId: 'c-2',
      circuitName: 'Circuito 2',
      workSeconds: 30,
      restSeconds: 10,
      timeString: '30s',
      weightKg: 0,
      reps: 0,
      rounds: 3,
    },
    {
      exerciseId: 'ex-func-2',
      exerciseName: 'Slam Balls (Lanzamiento de Balón al Suelo)',
      category: 'functional',
      equipment: 'medicine_ball',
      circuitId: 'c-2',
      circuitName: 'Circuito 2',
      workSeconds: 30,
      restSeconds: 10,
      timeString: '30s',
      weightKg: 8,
      reps: 9,
      rounds: 3,
    },
  ];

  const circuits: WorkoutCircuit[] = [
    {
      id: 'c-1',
      name: 'Circuito 1',
      rounds: 3,
      workSeconds: 30,
      restSeconds: 10,
      restBetweenCircuitsSeconds: 60,
      exercises: circuit1Exercises,
    },
    {
      id: 'c-2',
      name: 'Circuito 2',
      rounds: 3,
      workSeconds: 30,
      restSeconds: 10,
      restBetweenCircuitsSeconds: 0,
      exercises: circuit2Exercises,
    },
  ];

  const allExercisesInWorkout: ExerciseInWorkout[] = [];

  [...circuit1Exercises, ...circuit2Exercises].forEach((item, exIdx) => {
    const sets: WorkoutSet[] = [];
    for (let r = 1; r <= 3; r++) {
      sets.push({
        id: `set-upgraded-${session.id}-${exIdx}-${r}`,
        setNumber: r,
        weightKg: item.weightKg || 0,
        reps: item.reps || 0,
        repsDetail: item.repsDetail,
        timeString: item.timeString,
        workSeconds: item.workSeconds,
        restSeconds: item.restSeconds,
        completed: true,
      });
    }

    allExercisesInWorkout.push({
      id: `item-upgraded-${session.id}-${exIdx}`,
      exerciseId: item.exerciseId,
      exerciseName: item.exerciseName,
      category: item.category,
      equipment: item.equipment,
      circuitId: item.circuitId,
      circuitName: item.circuitName,
      sets,
      notes: item.repsDetail ? `Detalle: ${item.repsDetail}` : undefined,
    });
  });

  // Calculate volume: sum of (weightKg * reps * rounds)
  // Wall Balls: 8 * 9 * 3 = 216
  // Skipping with bag: 10 * 9 * 3 = 270
  // Skipping with press: 10 * 9 * 3 = 270
  // Row and curls: 30 * 5 * 3 = 450
  // Deadlift: 45 * 9 * 3 = 1215
  // Slam balls: 8 * 9 * 3 = 216
  // Total: 2637 kg
  const totalVolumeKg = 2637;

  return {
    ...session,
    routineName: 'Funcional (Circuito) • 1 oct',
    workoutType: 'functional',
    wodFormat: 'circuit',
    scoreOrRounds: '2 Circuits • 3 Rounds (30s × 10s)',
    durationSeconds: 1260, // Exactly 21 minutes
    totalWorkSeconds: 900,
    totalRestSeconds: 360,
    totalVolumeKg,
    completedSets: 30,
    totalSets: 30,
    circuits,
    exercises: allExercisesInWorkout,
  };
};
