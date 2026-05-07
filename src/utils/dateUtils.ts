import type { DayKey } from "../types";

export const MIN_DAYS_AHEAD = 2;
export const MAX_DAYS_AHEAD = 14;

export const dayKeyByIndex: DayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/** Returns a Date set to midnight of the given calendar day (local time). */
export const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const today = (): Date => startOfDay(new Date());

export const addDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/** Format YYYY-MM-DD in local time. */
export const toIsoDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Parse YYYY-MM-DD in local time (avoids UTC interpretation drift). */
export const fromIsoDate = (iso: string): Date => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

export const minOrderDate = (): Date => addDays(today(), MIN_DAYS_AHEAD);
export const maxOrderDate = (): Date => addDays(today(), MAX_DAYS_AHEAD);

export const dayKeyForDate = (date: Date): DayKey => dayKeyByIndex[date.getDay()];

export const isWithinOrderWindow = (date: Date): boolean => {
  const d = startOfDay(date).getTime();
  return d >= minOrderDate().getTime() && d <= maxOrderDate().getTime();
};

/** Returns the list of valid pickup dates (every day in the window). */
export const validOrderDates = (): Date[] => {
  const dates: Date[] = [];
  for (let i = MIN_DAYS_AHEAD; i <= MAX_DAYS_AHEAD; i += 1) {
    dates.push(addDays(today(), i));
  }
  return dates;
};

const longDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

export const formatLongDate = (date: Date): string => longDateFormatter.format(date);

export const formatRelativeOffset = (date: Date): string => {
  const days = Math.round(
    (startOfDay(date).getTime() - today().getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
};
