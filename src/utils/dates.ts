const MS_PER_DAY = 86400000;

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, n: number): Date {
  return new Date(startOfDay(d).getTime() + n * MS_PER_DAY);
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

/** Catering date must be 2–14 days after today (inclusive). */
export function isValidCateringDate(selected: Date, today: Date = new Date()): boolean {
  const delta = daysBetween(startOfDay(today), startOfDay(selected));
  return delta >= 2 && delta <= 14;
}

export function formatISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function weekdayIndex(d: Date): number {
  return d.getDay();
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function formatLongDate(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

export function minCateringDate(today: Date = new Date()): Date {
  return addDays(startOfDay(today), 2);
}

export function maxCateringDate(today: Date = new Date()): Date {
  return addDays(startOfDay(today), 14);
}
