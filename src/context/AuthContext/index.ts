'use client';

import { useSession } from "next-auth/react";

/**
 * Replaces the previous `useAuth` stub (`{ user: null }`).
 *
 * Returns the signed-in user plus convenience flags so the landing page and any
 * future client component can react to auth state without reaching into
 * `next-auth/react` directly.
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
