import { weeklyStreak } from './streaks';
import { type WorkoutSession } from '@/types';

const makeSession = (startedAt: string): WorkoutSession => ({
  id: `w-${startedAt}`,
  routineName: 'Test',
  startedAt,
  durationSeconds: 3600,
  totalVolumeKg: 100,
  completedSets: 5,
  totalSets: 5,
  exercises: [],
});

describe('weeklyStreak', () => {
  it('returns zeros when goalDays <= 0', () => {
    const history = [makeSession('2024-01-01T10:00:00.000Z')];
    expect(weeklyStreak(history, 0, new Date('2024-01-10'))).toEqual({
      current: 0,
      best: 0,
      daysThisWeek: 0,
    });
  });
});
