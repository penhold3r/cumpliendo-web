/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
      exclude: ['src/test/**', 'src/**/*.d.ts', 'src/**/*.stories.tsx'],
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
