'use client';

import { Button, Icon, Surface, Text } from '@latty-ds/react';

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--lt-spacing-6)',
        background: 'var(--lt-bg-canvas)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: 'var(--lt-spacing-8)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lt-spacing-4)', textAlign: 'center' }}>
          <Text
            variant="display-xl"
            style={{
              fontFamily: '"FunnelDisplay", system-ui, sans-serif',
              color: 'var(--lt-text-primary)',
            }}
          >
            Cumpliendo
          </Text>
          <Text variant="body" style={{ color: 'var(--lt-text-secondary)' }}>
            Track your workouts, build routines, and reach your goals
          </Text>
        </div>

        <Surface appearance="outlined" elevation="1" style={{ padding: 'var(--lt-spacing-6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lt-spacing-4)' }}>
            <Text variant="body" style={{ color: 'var(--lt-text-secondary)', textAlign: 'center' }}>
              Sign in to continue
            </Text>
            <Button variant="primary" full-width>
              <Icon name="user" size="sm" />
              Sign in with Google
            </Button>
          </div>
        </Surface>

        <Text variant="body-sm" style={{ color: 'var(--lt-text-tertiary)', textAlign: 'center' }}>
          Your data stays synced across devices
        </Text>
      </div>
    </main>
  );
}
