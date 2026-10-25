import { FIREBASE_CONFIG } from './firebaseConfig';

/** A value that can be stored in Firestore. */
export type FirestoreValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

/** A Firestore document with fields. */
export interface FirestoreDocument {
  fields?: Record<string, FirestoreValue>;
}

/** Convert a plain JavaScript value to a FirestoreValue. */
export function toFirestoreValue(val: unknown): FirestoreValue {
  if (val === null || val === undefined) {
    return { nullValue: null } as unknown as FirestoreValue;
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val } as unknown as FirestoreValue;
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return { integerValue: String(val) } as unknown as FirestoreValue;
    }
    return { doubleValue: val } as unknown as FirestoreValue;
  }
  if (typeof val === 'string') {
    return { stringValue: val } as unknown as FirestoreValue;
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } } as unknown as FirestoreValue;
  }
  if (typeof val === 'object') {
    const source = val as Record<string, unknown>;
    const fields: Record<string, FirestoreValue> = {};
    for (const key of Object.keys(source)) {
      if (source[key] !== undefined) {
        fields[key] = toFirestoreValue(source[key]);
      }
    }
    return { mapValue: { fields } } as unknown as FirestoreValue;
  }
  return { nullValue: null } as unknown as FirestoreValue;
}

/** Convert a plain object to a Firestore document with fields. */
export function toFirestoreDoc(data: object): FirestoreDocument {
  const source = data as Record<string, unknown>;
  const fields: Record<string, FirestoreValue> = {};
  for (const key of Object.keys(source)) {
    if (source[key] !== undefined) {
      fields[key] = toFirestoreValue(source[key]);
    }
  }
  return { fields };
}

/**
 * Save or update a user profile to Firestore.
 * Returns true on success, false on failure.
 */
export async function saveUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt?: string;
  lastLoginAt?: string;
}): Promise<boolean> {
  try {
    const url = `${FIREBASE_CONFIG.firestoreBaseUrl}/users/${encodeURIComponent(
      user.uid,
    )}/profile/data`;
    const docData = toFirestoreDoc({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      syncedAt: new Date().toISOString(),
    });

    const resp = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData),
    });

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => '(no body)');
      console.warn(`[Firestore] saveUserProfile failed ${resp.status}: ${errBody}`);
    }
    return resp.ok;
  } catch (error) {
    console.warn('[Firestore] Error saving user profile:', error);
    return false;
  }
}

export async function fetchUserDataFromFirestore(..._args: unknown[]) { return null; }
export async function saveStatsToFirestore(..._args: unknown[]) { return; }
export async function saveWorkoutSessionToFirestore(..._args: unknown[]) { return; }
export async function deleteWorkoutSessionFromFirestore(..._args: unknown[]) { return; }
export async function saveRoutineToFirestore(..._args: unknown[]) { return; }
export async function deleteRoutineFromFirestore(..._args: unknown[]) { return; }
export async function saveExerciseToFirestore(..._args: unknown[]) { return; }
export async function deleteExerciseFromFirestore(..._args: unknown[]) { return; }
export {};
