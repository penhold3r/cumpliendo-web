import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { i18n } from '@/i18n';
import { AddExerciseDialog } from './AddExerciseDialog';

const MOCK_EXERCISES = [
  {
    id: 'ex-piernas-1',
    name: 'Sentadilla (Squat)',
    category: 'legs',
    muscles: ['legs', 'glutes'],
    equipment: 'barbell',
    suggestedEquipment: ['dumbbells', 'kettlebell'],
    defaultRestSeconds: 150,
    workoutTypes: ['strength'],
  },
  {
    id: 'ex-pecho-1',
    name: 'Press de Banca Plano (Flat Bench Press)',
    category: 'chest',
    muscles: ['chest', 'arms', 'shoulders'],
    equipment: 'barbell',
    suggestedEquipment: ['dumbbells'],
    defaultRestSeconds: 120,
    workoutTypes: ['strength'],
  },
  {
    id: 'ex-espalda-1',
    name: 'Remo con Barra (Barbell Row)',
    category: 'back',
    muscles: ['back', 'arms'],
    equipment: 'barbell',
    suggestedEquipment: ['dumbbells', 'cable'],
    defaultRestSeconds: 120,
    workoutTypes: ['strength'],
  },
];

vi.mock('@/context/WorkoutContext', () => ({
  useWorkout: vi.fn(() => ({
    state: {
      exercises: MOCK_EXERCISES,
      routines: [],
      history: [],
      isCloudSyncing: false,
      stats: {
        totalWorkouts: 0,
        totalVolumeKg: 0,
        currentStreak: 0,
        bestStreak: 0,
        weeklyGoalDays: 0,
        completedThisWeek: 0,
        lastWorkoutDate: null,
        targetWeekdays: [],
      },
      activeWorkout: null,
      workoutDuration: 0,
      restTimer: {
        isActive: false,
        remainingSeconds: 0,
        initialSeconds: 0,
        endsAt: 0,
      },
    },
    dispatch: vi.fn(),
    refreshFromCloud: vi.fn(),
  })),
}));

describe('AddExerciseDialog', () => {
  const onClose = vi.fn();
  const onSelect = vi.fn();

  beforeEach(async () => {
    await i18n.changeLanguage('en');
    onClose.mockClear();
    onSelect.mockClear();
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <AddExerciseDialog open={false} onClose={onClose} onSelect={onSelect} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders title and search input when open', () => {
    render(
      <AddExerciseDialog open={true} onClose={onClose} onSelect={onSelect} />,
    );
    expect(screen.getByText('Add Exercise')).toBeInTheDocument();
    expect(screen.getByTestId('exercise-search')).toBeInTheDocument();
  });

  it('renders all exercises in the list', () => {
    render(
      <AddExerciseDialog open={true} onClose={onClose} onSelect={onSelect} />,
    );
    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.getByText('Flat Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Pull-ups')).toBeInTheDocument();
  });

  it('filters exercises by search query', () => {
    render(
      <AddExerciseDialog open={true} onClose={onClose} onSelect={onSelect} />,
    );
    fireEvent.change(screen.getByTestId('exercise-search'), {
      target: { value: 'squat' },
    });
    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.queryByText('Flat Bench Press')).not.toBeInTheDocument();
    expect(screen.queryByText('Barbell Row')).not.toBeInTheDocument();
  });

  it('shows equipment picker after selecting an exercise', () => {
    render(
      <AddExerciseDialog open={true} onClose={onClose} onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByTestId('exercise-row-ex-piernas-1'));
    // Should show exercise name as title
    expect(screen.getByText('Squat')).toBeInTheDocument();
    // Should show equipment chips
    expect(screen.getByTestId('equipment-chip-barbell')).toBeInTheDocument();
    expect(screen.getByTestId('equipment-chip-dumbbells')).toBeInTheDocument();
    expect(screen.getByTestId('equipment-chip-kettlebell')).toBeInTheDocument();
    // Should show Add button
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('calls onSelect with exercise, equipment, and category on confirm', () => {
    render(
      <AddExerciseDialog open={true} onClose={onClose} onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByTestId('exercise-row-ex-piernas-1'));
    // Pick different equipment
    fireEvent.click(screen.getByTestId('equipment-chip-dumbbells'));
    // Confirm
    fireEvent.click(screen.getByText('Add'));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(
      MOCK_EXERCISES[0],
      'dumbbells',
      'legs',
    );
  });

  it('goes back to search when back button is clicked on step 2', () => {
    render(
      <AddExerciseDialog open={true} onClose={onClose} onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByTestId('exercise-row-ex-piernas-1'));
    // Click back to search
    fireEvent.click(screen.getByText('Back to search'));
    // Should be back on search step
    expect(screen.getByTestId('exercise-search')).toBeInTheDocument();
  });

  it('shows "Show all" toggle for full equipment list', () => {
    render(
      <AddExerciseDialog open={true} onClose={onClose} onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByTestId('exercise-row-ex-piernas-1'));
    expect(
      screen.getByText('Show all equipment'),
    ).toBeInTheDocument();
  });
});
