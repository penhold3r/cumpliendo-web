import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Middleware that keeps the auth gate consistent:
 *   - Signed-in users on `/` (the landing/sign-in screen) are forwarded to `/home`.
 *   - Unauthenticated users on `/home` are sent back to `/`.
 *
 * `req.auth` is populated by NextAuth's `auth()` wrapper, so no extra cookie
 * decoding is needed here.
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isOnLanding = req.nextUrl.pathname === "/";
  const isOnHome = req.nextUrl.pathname === "/home";
  const isOnProfile = req.nextUrl.pathname === "/profile";
  const isOnRoutines = req.nextUrl.pathname === "/routines";
  const isOnExercises = req.nextUrl.pathname === "/exercises";

  if (isLoggedIn && isOnLanding) {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  if (!isLoggedIn && (isOnHome || isOnProfile || isOnRoutines || isOnExercises)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/home", "/profile", "/routines", "/exercises"],
};
