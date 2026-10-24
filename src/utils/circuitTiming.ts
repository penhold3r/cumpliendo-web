import { type WorkoutCircuit } from '../types';

export const DEFAULT_AMRAP_MINUTES = 8;

export const isAmrap = (circuit: WorkoutCircuit): boolean =>
  circuit.blockType === 'amrap';

/** AMRAP block duration in minutes (defaults to default value if omitted). */
export const amrapMinutes = (circuit: WorkoutCircuit): number =>
  circuit.timeCapMinutes ?? DEFAULT_AMRAP_MINUTES;

/**
 * Generated summary of a session with circuits (persisted in Spanish in `scoreOrRounds`):
 * "4 AMRAP × 8 min" or "2 Circuitos • 3 Vueltas (30s × 10s)". `scoreOrRoundsLabel` translates it.
 */
export const circuitsSummary = (
  circuits: WorkoutCircuit[],
): string | undefined => {
  const first = circuits[0];
  if (!first) return undefined;
  const count = circuits.length;
  if (circuits.every(isAmrap)) {
    const caps = circuits.map(amrapMinutes);
    const sameCap = caps.every(cap => cap === caps[0]);
    return sameCap
      ? `${count} AMRAP × ${amrapMinutes(first)} min`
      : `${count} AMRAP • ${caps.reduce((a, b) => a + b, 0)} min`;
  }
  const rounds = first.rounds || 1;
  const workSec = first.workSeconds || 30;
  const restSec = first.restSeconds ?? 10;
  return `${count} ${
    count === 1 ? 'Circuit' : 'Circuits'
  } • ${rounds} Rounds (${workSec}s × ${restSec}s)`;
};
