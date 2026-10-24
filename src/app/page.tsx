'use client';

import { Button, Icon } from '@latty-ds/react';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--lt-bg-canvas)] px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <h1
            className="text-4xl font-bold tracking-tight text-[var(--lt-text-primary)]"
            style={{ fontFamily: '"FunnelDisplay", system-ui, sans-serif' }}
          >
            Cumpliendo
          </h1>
          <p className="text-lg text-[var(--lt-text-secondary)]">
            Track your workouts, build routines, and reach your goals
          </p>
        </div>

        <div className="rounded-lg border border-[var(--lt-border-default)] bg-[var(--lt-bg-surface)] p-6 shadow-sm">
          <div className="space-y-4">
            <p className="text-sm text-[var(--lt-text-secondary)]">
              Sign in to continue
            </p>
            <Button variant="primary" className="w-full">
              <span className="flex items-center justify-center gap-2">
                <Icon name="user" size="sm" />
                Sign in with Google
              </span>
            </Button>
          </div>
        </div>

        <p className="text-xs text-[var(--lt-text-tertiary)]">
          Your data stays synced across devices
        </p>
      </div>
    </main>
  );
}
