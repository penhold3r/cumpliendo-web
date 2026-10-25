import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Cumpliendo authentication configuration (NextAuth.js v5).
 *
 * Google OAuth is the single sign-in provider. The OAuth access token and the
 * Google subject id are carried in a JWT session so both server components
 * (`auth()`) and client components (`useSession`) can read who is signed in.
 *
 * Required environment variables (see .env.example):
 *   AUTH_SECRET        — signs/encrypts the session JWT
 *   AUTH_GOOGLE_ID     — Google OAuth client id
 *   AUTH_GOOGLE_SECRET — Google OAuth client secret
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist provider details on first sign-in.
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (profile) {
        token.id = (profile as { sub?: string }).sub ?? token.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the id and access token on the session visible to clients.
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { accessToken?: string }).accessToken =
          token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // unauthenticated users land on the branded sign-in screen
    error: "/", // send OAuth errors back to the landing page
  },
});
