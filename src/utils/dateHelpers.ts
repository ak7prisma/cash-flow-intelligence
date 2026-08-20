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
