import { describe, expect, it, vi } from 'vitest';
import { saveUserProfile } from './firebaseFirestoreService';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockUser = {
  uid: 'usr_google_1234567890',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLoginAt: '2026-10-25T12:00:00.000Z',
};

describe('saveUserProfile', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
  });

  it('sends a PATCH request to the user profile endpoint', async () => {
    await saveUserProfile(mockUser);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/users/usr_google_1234567890/profile/data');
    expect(options?.method).toBe('PATCH');
  });

  it('includes uid, email, displayName, photoURL in the body', async () => {
    await saveUserProfile(mockUser);

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options?.body as string);
    expect(body.fields.uid).toEqual({ stringValue: 'usr_google_1234567890' });
    expect(body.fields.email).toEqual({ stringValue: 'test@example.com' });
    expect(body.fields.displayName).toEqual({ stringValue: 'Test User' });
    expect(body.fields.photoURL).toEqual({ nullValue: null });
    expect(body.fields.createdAt).toEqual({ stringValue: '2026-01-01T00:00:00.000Z' });
    expect(body.fields.lastLoginAt).toEqual({ stringValue: '2026-10-25T12:00:00.000Z' });
    expect(body.fields.syncedAt).toEqual({ stringValue: expect.any(String) });
  });

  it('returns true on success', async () => {
    const result = await saveUserProfile(mockUser);
    expect(result).toBe(true);
  });

  it('returns false on non-ok response', async () => {
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ error: 'fail' }), { status: 500 }));
    const result = await saveUserProfile(mockUser);
    expect(result).toBe(false);
  });

  it('returns false on network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const result = await saveUserProfile(mockUser);
    expect(result).toBe(false);
  });
});
