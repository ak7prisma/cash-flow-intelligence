import { describe, expect, it } from "vitest";
import { buildChartTrend } from "./chartHelpers";
import { ExpenseTransaction, IncomeTransaction } from "../models/Transaction";

const USER_ID = "test-user";

function expense(amount: number, date: Date) {
  return new ExpenseTransaction({ userId: USER_ID, amount, category: "Food & Beverage", date });
}

function income(amount: number, date: Date) {
  return new IncomeTransaction({ userId: USER_ID, amount, category: "Salary", date });
}

describe("buildChartTrend", () => {
  const wednesday = new Date(2026, 10, 11, 10, 0);

  it("always starts on Monday and ends on Sunday for weekly charts", () => {
    const trend = buildChartTrend([], "weekly", wednesday);
    expect(trend.labels).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    expect(trend.expense).toHaveLength(7);
    expect(trend.income).toHaveLength(7);
  });

  it("buckets the current week and leaves future days empty", () => {
    const transactions = [
      expense(100, new Date(2026, 10, 9, 9)), // Monday
      income(50, new Date(2026, 10, 11, 9)), // Wednesday (today)
      expense(30, new Date(2026, 10, 13, 9)), // Friday (future)
      expense(999, new Date(2026, 10, 8, 9)), // previous Sunday
    ];

    const trend = buildChartTrend(transactions, "weekly", wednesday);

    expect(trend.expense).toEqual([100, 0, 0, 0, 0, 0, 0]);
    expect(trend.income).toEqual([0, 0, 50, 0, 0, 0, 0]);
  });

  it("groups monthly charts by day and ignores other months", () => {
    const transactions = [
      expense(10, new Date(2026, 10, 1, 9)),
      income(20, new Date(2026, 10, 11, 9)),
      expense(999, new Date(2026, 9, 31, 9)),
    ];

    const trend = buildChartTrend(transactions, "monthly", wednesday);

    expect(trend.labels).toHaveLength(30);
    expect(trend.expense[0]).toBe(10);
    expect(trend.income[10]).toBe(20);
    expect(trend.expense.reduce((sum, value) => sum + value, 0)).toBe(10);
  });

  it("groups yearly charts by month and ignores other years and future months", () => {
    const transactions = [
      income(100, new Date(2026, 0, 5, 9)),
      expense(40, new Date(2026, 10, 11, 9)),
      expense(999, new Date(2025, 10, 11, 9)),
      income(999, new Date(2026, 11, 1, 9)),
    ];

    const trend = buildChartTrend(transactions, "yearly", wednesday);

    expect(trend.labels).toHaveLength(12);
    expect(trend.income[0]).toBe(100);
    expect(trend.expense[10]).toBe(40);
    expect(trend.expense.reduce((sum, value) => sum + value, 0)).toBe(40);
    expect(trend.income.reduce((sum, value) => sum + value, 0)).toBe(100);
  });
});
