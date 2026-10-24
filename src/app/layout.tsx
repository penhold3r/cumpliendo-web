import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { lattyStyleSheet } from "@/theme/lattyConfig";

export const metadata: Metadata = {
  title: "Cumpliendo",
  description: "Track your workouts, build routines, and reach your goals",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* SSR-injected Latty tokens so the first paint uses the Cumpliendo palette. */}
        <style id="lt-tokens" dangerouslySetInnerHTML={{ __html: lattyStyleSheet }} />
      </head>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
