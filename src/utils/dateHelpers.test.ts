import { describe, expect, it } from "vitest";
import {
  diffInDays,
  getEndOfDay,
  getLocalDateISO,
  getStartOfWeek,
  parseLocalDate,
} from "./dateHelpers";

describe("dateHelpers", () => {
  it("parses date-only strings as local midnight", () => {
    const date = parseLocalDate("2026-11-11");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(10);
    expect(date.getDate()).toBe(11);
    expect(date.getHours()).toBe(0);
  });

  it("formats a local date as YYYY-MM-DD", () => {
    expect(getLocalDateISO(new Date(2026, 10, 11, 23, 59))).toBe("2026-11-11");
  });

  it("returns Monday as the start of the week", () => {
    const wednesday = new Date(2026, 10, 11);
    const monday = getStartOfWeek(wednesday);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(9);
  });

  it("returns the previous Monday for a Sunday", () => {
    const sunday = new Date(2026, 10, 15);
    const monday = getStartOfWeek(sunday);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(9);
  });

  it("returns the end of the day", () => {
    const end = getEndOfDay(new Date(2026, 10, 11, 8, 30));
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
    expect(end.getSeconds()).toBe(59);
    expect(end.getMilliseconds()).toBe(999);
  });

  it("counts whole days between local dates", () => {
    expect(diffInDays(new Date(2026, 10, 9), new Date(2026, 10, 11))).toBe(2);
    expect(diffInDays(new Date(2026, 10, 11), new Date(2026, 10, 9))).toBe(-2);
  });
});
