import { getLocaleTag, i18n } from '../i18n';
import { calendarDaysAgo } from './homeInsights';

export const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};

export const formatDurationReadable = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
};

const sameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

/** "Today", "Yesterday" or "Mon, Oct 5" / "lun, 5 oct" depending on active locale. */
export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const today = new Date();
    if (sameDay(date, today)) return i18n.t('date.today');

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (sameDay(date, yesterday)) return i18n.t('date.yesterday');

    return date.toLocaleDateString(getLocaleTag(), {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return isoString;
  }
};

/** "Today", "Yesterday" or "9 days ago" / "Hace 9 días". */
export const formatDaysAgo = (isoString: string): string => {
  const days = calendarDaysAgo(isoString);
  if (days === 0) return i18n.t('date.today');
  if (days === 1) return i18n.t('date.yesterday');
  return i18n.t('date.daysAgo', { n: days });
};

/** "Oct 5" / "5 oct". */
export const formatDateShort = (dateInput: Date | string): string => {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return d.toLocaleDateString(getLocaleTag(), {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return '';
  }
};

/** "Monday, October 5" / "Lunes, 5 de octubre". */
export const formatDateLong = (dateInput: Date | string): string => {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const tag = getLocaleTag();
    const weekday = d.toLocaleDateString(tag, { weekday: 'long' });
    const month = d.toLocaleDateString(tag, { month: 'long' });
    return i18n.t('date.long', {
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      day: d.getDate(),
      month,
    });
  } catch {
    return String(dateInput);
  }
};

export { getExerciseIcon } from './exerciseIcon';
