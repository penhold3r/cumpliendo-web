import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { i18n } from '@/i18n';
import { ExerciseItemHeader } from './ExerciseItemHeader';

describe('ExerciseItemHeader', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders exercise name', () => {
    render(
      <ExerciseItemHeader
        exerciseName="Bench Press"
        category="chest"
        equipment="barbell"
      />,
    );
    expect(screen.getByText('Bench Press')).toBeDefined();
  });

  it('renders muscle and equipment subtitle', () => {
    render(
      <ExerciseItemHeader
        exerciseName="Bench Press"
        category="chest"
        equipment="barbell"
        muscles={['chest', 'triceps']}
      />,
    );
    expect(screen.getByText(/Chest.*Triceps/i)).toBeDefined();
  });

  it('falls back to category for muscles when muscles not provided', () => {
    render(
      <ExerciseItemHeader
        exerciseName="Squat"
        category="legs"
        equipment="barbell"
      />,
    );
    expect(screen.getByText(/Legs/i)).toBeDefined();
  });

  it('renders actions slot', () => {
    render(
      <ExerciseItemHeader
        exerciseName="Deadlift"
        category="back"
        equipment="barbell"
        actions={<button data-testid="remove-btn">Remove</button>}
      />,
    );
    expect(screen.getByTestId('remove-btn')).toBeDefined();
  });
});
