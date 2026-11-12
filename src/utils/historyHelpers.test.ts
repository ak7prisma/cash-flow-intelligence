import { describe, expect, it } from "vitest";
import { ALL_CATEGORIES, filterTransactions } from "./historyHelpers";
import { ExpenseTransaction, IncomeTransaction } from "../models/Transaction";

const USER_ID = "test-user";

const transactions = [
  new ExpenseTransaction({
    userId: USER_ID,
    amount: 100,
    category: "Food & Beverage",
    date: new Date(2026, 10, 9, 9),
  }),
  new IncomeTransaction({
    userId: USER_ID,
    amount: 500,
    category: "Salary",
    date: new Date(2026, 10, 11, 9),
  }),
  new ExpenseTransaction({
    userId: USER_ID,
    amount: 75,
    category: "Transportation",
    date: new Date(2026, 10, 15, 9),
  }),
];

const noFilters = {
  activeFilter: "All",
  category: ALL_CATEGORIES,
  dateFrom: "",
  dateTo: "",
};

describe("filterTransactions", () => {
  it("returns everything when no filters are applied", () => {
    expect(filterTransactions(transactions, noFilters)).toHaveLength(3);
  });

  it("filters by transaction type", () => {
    const result = filterTransactions(transactions, { ...noFilters, activeFilter: "Income" });
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("Salary");
  });

  it("filters by category", () => {
    const result = filterTransactions(transactions, {
      ...noFilters,
      category: "Food & Beverage",
    });
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(100);
  });

  it("filters by inclusive date range", () => {
    const result = filterTransactions(transactions, {
      ...noFilters,
      dateFrom: "2026-11-09",
      dateTo: "2026-11-11",
    });
    expect(result).toHaveLength(2);
    expect(result.map((item) => item.amount)).toEqual([100, 500]);
  });

  it("combines type, category, and date filters", () => {
    const result = filterTransactions(transactions, {
      activeFilter: "Expense",
      category: "Transportation",
      dateFrom: "2026-11-12",
      dateTo: "2026-11-20",
    });
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(75);
  });
});
