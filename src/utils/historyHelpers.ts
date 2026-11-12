import type { Transaction } from "../models/Transaction";
import { getEndOfDay, parseLocalDate } from "./dateHelpers";

export const ALL_CATEGORIES = "All Categories";

export interface HistoryFilters {
  activeFilter: string;
  category: string;
  dateFrom: string;
  dateTo: string;
}

export function filterTransactions(
  transactions: Transaction[],
  filters: HistoryFilters
): Transaction[] {
  const from = filters.dateFrom ? parseLocalDate(filters.dateFrom) : null;
  const to = filters.dateTo ? getEndOfDay(parseLocalDate(filters.dateTo)) : null;

  return transactions.filter((item) => {
    if (
      filters.activeFilter !== "All" &&
      item.type.toLowerCase() !== filters.activeFilter.toLowerCase()
    ) {
      return false;
    }

    if (filters.category !== ALL_CATEGORIES && item.category !== filters.category) {
      return false;
    }

    const itemDate = new Date(item.date);
    if (from && itemDate < from) return false;
    if (to && itemDate > to) return false;

    return true;
  });
}
