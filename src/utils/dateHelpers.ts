/*
  Timezone-safe date helpers.
  JS parses date-only strings ("YYYY-MM-DD") as UTC midnight, which shifts
  to 07:00 in WIB (UTC+7). These helpers keep everything in local time.
*/

// Parses "YYYY-MM-DD" as LOCAL midnight instead of UTC.
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Returns today's date as "YYYY-MM-DD" based on LOCAL time (not UTC).
export function getLocalDateISO(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Returns the Monday (00:00 local time) of the week containing the given date.
export function getStartOfWeek(date: Date = new Date()): Date {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  const daysSinceMonday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - daysSinceMonday);
  return monday;
}

// Returns the given date at 23:59:59.999 local time.
export function getEndOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

// Whole-day difference between two local dates (DST-safe).
export function diffInDays(from: Date, to: Date): number {
  const a = new Date(from);
  const b = new Date(to);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}
