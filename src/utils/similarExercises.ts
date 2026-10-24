import { type Exercise } from '../types';

const MAX_RESULTS = 3;
/** Below this length, "contains" yields too many false positives ("ab", "row"). */
const MIN_CONTAINS_LENGTH = 4;

/** Lowercase, stripped accents and symbols, basic plurals removed: "Curls" → "curl". */
const words = (text: string): string[] =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(w => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w));

/**
 * Exercise comparison variants: full name plus individual segments when parentheses
 * contain another language ("Peso Muerto (Deadlift)").
 */
const nameVariants = (name: string): string[][] => {
  const parts = [name];
  const m = /^(.*?)\s*\((.+)\)\s*$/.exec(name);
  if (m?.[1] && m[2]) parts.push(m[1], m[2]);
  return parts.map(words).filter(w => w.length > 0);
};

const isSimilar = (typed: string[], candidate: string[]): boolean => {
  const a = typed.join(' ');
  const b = candidate.join(' ');
  if (a === b) return true;
  if (
    a.length >= MIN_CONTAINS_LENGTH &&
    b.length >= MIN_CONTAINS_LENGTH &&
    (` ${b} `.includes(` ${a} `) || ` ${a} `.includes(` ${b} `))
  ) {
    return true;
  }
  // All typed words appear in the candidate name ("row curl" → "row curl combo")
  return typed.length >= 2 && typed.every(word => candidate.includes(word));
};

/**
 * Library exercises with names similar to user input, warning before creating duplicates.
 * Ignores accents, casing, symbols, and basic plurals; checks both language segments for
 * built-ins. Exact matches appear first.
 */
export const findSimilarExercises = (
  name: string,
  exercises: Exercise[],
): Exercise[] => {
  const typed = words(name);
  if (typed.join('').length < 3) return [];
  const exactText = typed.join(' ');
  return exercises
    .filter(ex => nameVariants(ex.name).some(v => isSimilar(typed, v)))
    .sort((x, y) => {
      const exact = (ex: Exercise) =>
        nameVariants(ex.name).some(v => v.join(' ') === exactText) ? 0 : 1;
      return exact(x) - exact(y);
    })
    .slice(0, MAX_RESULTS);
};
