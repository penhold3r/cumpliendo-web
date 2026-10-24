'use client';

import { configure } from '@latty-ds/tokens/configure';

export function initLattyTheme() {
  configure({
    colors: {
      primary: '#4F46E5',
      secondary: '#5252c5',
      success: '#22c55e',
      warning: '#eeb308',
      error: '#ef4444',
      info: '#0ea5e9',
    },
    border: {
      radius: '4px',
    },
    font: {
      family: ['"FunnelDisplay", system-ui, sans-serif'],
      heading: '"FunnelDisplay", system-ui, sans-serif',
    },
  });
}
