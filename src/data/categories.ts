export const EXPENSE_CATEGORIES = [
  "Other",
  "Food & Beverage",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Education",
  "Shopping",
  "Bill",
] as const;

export const INCOME_CATEGORIES = [
  "Others (Income)",
  "Salary",
  "Bonus",
  "Investment",
] as const;

export const CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type TransactionCategory = (typeof CATEGORIES)[number];