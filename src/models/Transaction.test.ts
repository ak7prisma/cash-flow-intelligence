import { describe, it, expect } from 'vitest';
import { IncomeTransaction, ExpenseTransaction } from './Transaction';

describe('Transaction Model (OOP Refactor)', () => {
  const mockDate = new Date('2026-05-01T10:00:00Z');
  
  const incomeParams = {
    userId: 'user-123',
    amount: 1500000,
    category: 'Salary',
    date: mockDate,
    note: 'Bonus'
  };

  const expenseParams = {
    userId: 'user-123',
    amount: 250000,
    category: 'Food',
    date: mockDate
  };

  it('should initialize IncomeTransaction correctly', () => {
    const transaction = new IncomeTransaction(incomeParams);
    expect(transaction.amount).toBe(1500000);
    expect(transaction.type).toBe('income');
    expect(transaction.category).toBe('Salary');
    expect(transaction.note).toBe('Bonus');
  });

  it('should initialize ExpenseTransaction correctly', () => {
    const transaction = new ExpenseTransaction(expenseParams);
    expect(transaction.amount).toBe(250000);
    expect(transaction.type).toBe('expense');
    expect(transaction.category).toBe('Food');
  });

  it('should format amount correctly for income (Polymorphism)', () => {
    const transaction = new IncomeTransaction(incomeParams);
    const formatted = transaction.getFormattedAmount();
    expect(formatted).toContain('+');
    expect(formatted).toContain('1.500.000');
  });

  it('should format amount correctly for expense (Polymorphism)', () => {
    const transaction = new ExpenseTransaction(expenseParams);
    const formatted = transaction.getFormattedAmount();
    expect(formatted).toContain('-');
    expect(formatted).toContain('250.000');
  });

  it('should serialize to JSON correctly', () => {
    const transaction = new IncomeTransaction(incomeParams);
    const json = transaction.toJSON();
    expect(json.amount).toBe(1500000);
    expect(json.type).toBe('income');
    expect(json.date).toBe(mockDate.toISOString());
  });
});

