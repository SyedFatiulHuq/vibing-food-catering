function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Minimum days ahead (inclusive) customer may schedule pickup */
export const MIN_LEAD_DAYS = 2;

/** Maximum days ahead (inclusive) */
export const MAX_LEAD_DAYS = 14;

export function getToday(): Date {
  return startOfDay(new Date());
}

export function parseLocalDate(isoDate: string): Date {
  const [y, m, day] = isoDate.split("-").map(Number);
  return startOfDay(new Date(y!, (m ?? 1) - 1, day ?? 1));
}

export function formatIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

export function getEarliestOrderDate(): Date {
  return addDays(getToday(), MIN_LEAD_DAYS);
}

export function getLatestOrderDate(): Date {
  return addDays(getToday(), MAX_LEAD_DAYS);
}

export function isValidCateringDate(isoDate: string): boolean {
  const d = parseLocalDate(isoDate);
  const lo = getEarliestOrderDate();
  const hi = getLatestOrderDate();
  return d >= lo && d <= hi;
}

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function weekdayFromIso(isoDate: string): (typeof WEEKDAYS)[number] {
  const d = parseLocalDate(isoDate);
  return WEEKDAYS[d.getDay()]!;
}

export function readableDate(isoDate: string): string {
  const d = parseLocalDate(isoDate);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function listSelectableDates(): string[] {
  const out: string[] = [];
  for (let i = MIN_LEAD_DAYS; i <= MAX_LEAD_DAYS; i++) {
    out.push(formatIsoLocal(addDays(getToday(), i)));
  }
  return out;
}
