import { handlers } from "@/auth";

/**
 * NextAuth route handler for the App Router.
 *
 * Mounted at `src/app/api/auth/[...nextauth]/route.ts`, this exposes:
 *   GET  /api/auth/session       — current session
 *   GET  /api/auth/signin/google — start the Google OAuth flow
 *   GET/POST /api/auth/callback/google — OAuth callback from Google
 *   POST /api/auth/signout       — sign out
 */
export const { GET, POST } = handlers;
