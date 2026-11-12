import type { Transaction } from "../models/Transaction";
import { diffInDays, getStartOfWeek } from "./dateHelpers";

export type ChartPeriod = "weekly" | "monthly" | "yearly";
export type ChartMode = "expense" | "income" | "both";

export interface ChartTrend {
  labels: string[];
  income: number[];
  expense: number[];
}

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function getPeriodLabels(period: ChartPeriod, today: Date): string[] {
  if (period === "weekly") return [...WEEK_LABELS];
  if (period === "yearly") return [...MONTH_LABELS];

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => String(index + 1));
}

export function getBucketIndex(
  transaction: Transaction,
  period: ChartPeriod,
  today: Date,
  weekStart: Date
): number {
  const date = new Date(transaction.date);
  date.setHours(0, 0, 0, 0);

  // Future dates should stay empty on the chart.
  if (date.getTime() > today.getTime()) return -1;

  if (period === "weekly") {
    const index = diffInDays(weekStart, date);
    return index >= 0 && index < 7 ? index : -1;
  }

  if (period === "monthly") {
    if (
      date.getFullYear() !== today.getFullYear() ||
      date.getMonth() !== today.getMonth()
    ) {
      return -1;
    }
    return date.getDate() - 1;
  }

  if (date.getFullYear() !== today.getFullYear()) return -1;
  return date.getMonth();
}

export function buildChartTrend(
  transactions: Transaction[],
  period: ChartPeriod,
  now: Date = new Date()
): ChartTrend {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const weekStart = getStartOfWeek(today);
  const labels = getPeriodLabels(period, today);
  const income = new Array<number>(labels.length).fill(0);
  const expense = new Array<number>(labels.length).fill(0);

  transactions.forEach((transaction) => {
    const index = getBucketIndex(transaction, period, today, weekStart);
    if (index < 0 || index >= labels.length) return;

    if (transaction.type === "income") {
      income[index] += transaction.amount;
    } else {
      expense[index] += transaction.amount;
    }
  });

  return { labels, income, expense };
}
