import { i18n } from '../i18n';
/**
 * Optional warmup (start) and cooldown (end) blocks for a session or routine.
 * Records only minutes: contributes to overall duration, not volume or sets.
 */
export type SessionBlockKind = 'warmup' | 'cooldown';

export const BLOCK_STEP_MINUTES = 5;
export const BLOCK_MAX_MINUTES = 60;

/** Block name in the active language. */
export const blockLabel = (kind: SessionBlockKind): string =>
  i18n.t(`blocks.${kind}.label`);

/** "At start / at end of session". */
export const blockHint = (kind: SessionBlockKind): string =>
  i18n.t(`blocks.${kind}.hint`);

export const BLOCK_ICONS: Record<SessionBlockKind, string> = {
  warmup: 'run-fast',
  cooldown: 'yoga',
};

interface WithBlocks {
  warmupMinutes?: number;
  cooldownMinutes?: number;
}

/** Total block minutes (warmup + cooldown). */
export const blockMinutesTotal = ({
  warmupMinutes,
  cooldownMinutes,
}: WithBlocks): number => (warmupMinutes ?? 0) + (cooldownMinutes ?? 0);

/** Normalizes to `undefined` when the block is 0 or omitted, avoiding storing zero values. */
export const toBlockMinutes = (
  minutes: number | undefined,
): number | undefined => (minutes && minutes > 0 ? minutes : undefined);

export const formatBlockMinutes = (minutes: number): string =>
  minutes > 0 ? `${minutes} min` : i18n.t('blocks.none');
