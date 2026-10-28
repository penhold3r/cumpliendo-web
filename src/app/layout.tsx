import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { BOOTSTRAP_SCRIPT } from "./bootstrapScript";
import { lattyStyleSheet } from "@/theme/lattyConfig";
import { DEFAULT_LANGUAGE } from "@/i18n/constants";

export const metadata: Metadata = {
  title: "Cumpliendo",
  description: "Track your workouts, build routines, and reach your goals",
};

/**
 * The shell is static on purpose: the per-request language is resolved by the
 * page (see `page.tsx`) and applied to `<html lang>` before first paint by the
 * bootstrap script below. Reading cookies here would make every route — the
 * 404 included — block on a dynamic render.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      style={{ minHeight: '100%' }}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme and language before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP_SCRIPT }} />
        {/* SSR-injected Latty tokens so the first paint uses the Cumpliendo palette. */}
        <style id="lt-tokens" dangerouslySetInnerHTML={{ __html: lattyStyleSheet }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
