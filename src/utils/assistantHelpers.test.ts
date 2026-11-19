import { describe, it, expect } from 'vitest';
import { formatIDR, generateId, getCurrentTime, buildFinancialContext } from './assistantHelpers';
import { IncomeTransaction } from '../models/IncomeTransaction';
import { ExpenseTransaction } from '../models/ExpenseTransaction';

describe('assistantHelpers', () => {
  describe('formatIDR', () => {
    it('should format numbers to Indonesian Rupiah', () => {
      const formatted = formatIDR(50000);
      expect(formatted).toContain('50.000');
      expect(formatted).toContain('Rp');
    });

    it('should format 0 correctly', () => {
      const formatted = formatIDR(0);
      expect(formatted).toContain('0');
      expect(formatted).toContain('Rp');
    });
  });

  describe('generateId', () => {
    it('should return a unique string starting with msg-', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1.startsWith('msg-')).toBe(true);
      expect(id2.startsWith('msg-')).toBe(true);
      expect(id1).not.toBe(id2);
    });
  });

  describe('getCurrentTime', () => {
    it('should return a time string in AM/PM format', () => {
      const time = getCurrentTime();
      expect(time).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    });
  });

  describe('buildFinancialContext', () => {
    it('should aggregate today, this month, and overall statistics accurately', () => {
      const fixedNow = new Date('2026-11-19T10:00:00');
      const todayDate = new Date('2026-11-19T08:30:00');
      const earlierThisMonth = new Date('2026-11-05T14:00:00');
      const lastMonth = new Date('2026-10-20T10:00:00');

      const transactions = [
        new IncomeTransaction({
          id: '1',
          userId: 'user-1',
          amount: 500000,
          category: 'Salary',
          date: todayDate,
          note: 'Side hustle',
        }),
        new ExpenseTransaction({
          id: '2',
          userId: 'user-1',
          amount: 50000,
          category: 'Food & Beverage',
          date: todayDate,
          note: 'Lunch',
        }),
        new ExpenseTransaction({
          id: '3',
          userId: 'user-1',
          amount: 200000,
          category: 'Transportation',
          date: earlierThisMonth,
          note: 'Fuel',
        }),
        new IncomeTransaction({
          id: '4',
          userId: 'user-1',
          amount: 1000000,
          category: 'Bonus',
          date: lastMonth,
          note: 'Bonus',
        }),
      ];

      const context = buildFinancialContext(transactions, fixedNow);

      expect(context.currentDate).toBe('2026-11-19');
      // Today stats
      expect(context.todayStats.income).toBe(500000);
      expect(context.todayStats.expense).toBe(50000);
      expect(context.todayStats.net).toBe(450000);
      expect(context.todayStats.transactionsCount).toBe(2);

      // This month stats
      expect(context.thisMonthStats.income).toBe(500000);
      expect(context.thisMonthStats.expense).toBe(250000); // 50000 + 200000
      expect(context.thisMonthStats.netSavings).toBe(250000);
      expect(context.thisMonthStats.expenseByCategory['Food & Beverage']).toBe(50000);
      expect(context.thisMonthStats.expenseByCategory['Transportation']).toBe(200000);

      // Overall stats
      expect(context.overallStats.totalIncome).toBe(1500000);
      expect(context.overallStats.totalExpense).toBe(250000);
      expect(context.overallStats.balance).toBe(1250000);

      // Recent transactions
      expect(context.recentTransactions.length).toBe(4);
      expect(context.recentTransactions[0].category).toBe('Salary');
    });

    it('should handle empty transactions cleanly', () => {
      const fixedNow = new Date('2026-11-19T10:00:00');
      const context = buildFinancialContext([], fixedNow);

      expect(context.todayStats.income).toBe(0);
      expect(context.todayStats.expense).toBe(0);
      expect(context.thisMonthStats.income).toBe(0);
      expect(context.thisMonthStats.expense).toBe(0);
      expect(context.overallStats.balance).toBe(0);
      expect(context.recentTransactions).toEqual([]);
    });
  });
});
