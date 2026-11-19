import React from "react";
import type { Transaction } from "../models/Transaction";
import { getLocalDateISO } from "./dateHelpers";

export interface ChatMessage {
  id: string;
  type: "bot" | "user";
  message: string | React.ReactNode;
  time: string;
  insight?: {
    title: string;
    content: string;
  };
}

// Returns the current time formatted as "HH:MM AM/PM".
export function getCurrentTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a number as IDR currency string.
 * Example: 75000 → "Rp 75.000"
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

//Generates a unique ID for each chat message.
let messageCounter = 0;
export function generateId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

export interface FinancialContext {
  currentDate: string;
  currentMonthYear: string;
  todayStats: {
    income: number;
    expense: number;
    incomeFormatted: string;
    expenseFormatted: string;
    net: number;
    netFormatted: string;
    transactionsCount: number;
    transactions: Array<{
      amount: number;
      amountFormatted: string;
      type: "income" | "expense";
      category: string;
      note?: string;
    }>;
  };
  thisMonthStats: {
    monthName: string;
    income: number;
    expense: number;
    incomeFormatted: string;
    expenseFormatted: string;
    netSavings: number;
    netSavingsFormatted: string;
    expenseByCategory: Record<string, number>;
    incomeByCategory: Record<string, number>;
  };
  overallStats: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    totalIncomeFormatted: string;
    totalExpenseFormatted: string;
    balanceFormatted: string;
  };
  recentTransactions: Array<{
    date: string;
    type: "income" | "expense";
    category: string;
    amount: number;
    amountFormatted: string;
    note?: string;
  }>;
}

export function buildFinancialContext(
  transactions: Transaction[],
  now: Date = new Date()
): FinancialContext {
  const todayStr = getLocalDateISO(now);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const monthName = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  let todayIncome = 0;
  let todayExpense = 0;
  const todayTxs: FinancialContext["todayStats"]["transactions"] = [];

  let monthIncome = 0;
  let monthExpense = 0;
  const expenseByCategory: Record<string, number> = {};
  const incomeByCategory: Record<string, number> = {};

  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of transactions) {
    const txDate = new Date(tx.date);
    const txDateStr = getLocalDateISO(txDate);
    const isToday = txDateStr === todayStr;
    const isThisMonth = txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;

    if (tx.type === "income") {
      totalIncome += tx.amount;
      if (isToday) {
        todayIncome += tx.amount;
        todayTxs.push({
          amount: tx.amount,
          amountFormatted: formatIDR(tx.amount),
          type: "income",
          category: tx.category,
          note: tx.note,
        });
      }
      if (isThisMonth) {
        monthIncome += tx.amount;
        incomeByCategory[tx.category] = (incomeByCategory[tx.category] || 0) + tx.amount;
      }
    } else {
      totalExpense += tx.amount;
      if (isToday) {
        todayExpense += tx.amount;
        todayTxs.push({
          amount: tx.amount,
          amountFormatted: formatIDR(tx.amount),
          type: "expense",
          category: tx.category,
          note: tx.note,
        });
      }
      if (isThisMonth) {
        monthExpense += tx.amount;
        expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
      }
    }
  }

  const recentTransactions = transactions.slice(0, 10).map((tx) => ({
    date: getLocalDateISO(new Date(tx.date)),
    type: tx.type,
    category: tx.category,
    amount: tx.amount,
    amountFormatted: formatIDR(tx.amount),
    note: tx.note,
  }));

  return {
    currentDate: todayStr,
    currentMonthYear: monthName,
    todayStats: {
      income: todayIncome,
      expense: todayExpense,
      incomeFormatted: formatIDR(todayIncome),
      expenseFormatted: formatIDR(todayExpense),
      net: todayIncome - todayExpense,
      netFormatted: formatIDR(todayIncome - todayExpense),
      transactionsCount: todayTxs.length,
      transactions: todayTxs,
    },
    thisMonthStats: {
      monthName,
      income: monthIncome,
      expense: monthExpense,
      incomeFormatted: formatIDR(monthIncome),
      expenseFormatted: formatIDR(monthExpense),
      netSavings: monthIncome - monthExpense,
      netSavingsFormatted: formatIDR(monthIncome - monthExpense),
      expenseByCategory,
      incomeByCategory,
    },
    overallStats: {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      totalIncomeFormatted: formatIDR(totalIncome),
      totalExpenseFormatted: formatIDR(totalExpense),
      balanceFormatted: formatIDR(totalIncome - totalExpense),
    },
    recentTransactions,
  };
}
