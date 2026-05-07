/** Start of local calendar day. */
export function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addLocalDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return startOfLocalDay(x);
}

export const MIN_LEAD_DAYS = 2;
export const MAX_LEAD_DAYS = 14;

export function cateringDateRange(today: Date = new Date()): {
  min: Date;
  max: Date;
} {
  const t = startOfLocalDay(today);
  return {
    min: addLocalDays(t, MIN_LEAD_DAYS),
    max: addLocalDays(t, MAX_LEAD_DAYS),
  };
}

export function isValidCateringDate(
  selected: Date,
  today: Date = new Date(),
): boolean {
  const { min, max } = cateringDateRange(today);
  const s = startOfLocalDay(selected).getTime();
  return s >= min.getTime() && s <= max.getTime();
}

export function toIsoDateOnly(d: Date): string {
  const x = startOfLocalDay(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIsoDateOnly(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return startOfLocalDay(dt);
}

export function formatDisplayDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
