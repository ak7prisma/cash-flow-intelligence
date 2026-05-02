import { describe, it, expect } from 'vitest';
import { Transaction } from './Transaction';

describe('Transaction Model', () => {
  const mockDate = new Date('2026-05-01T10:00:00Z');
  
  const incomeParams = {
    userId: 'user-123',
    amount: 1500000,
    type: 'income' as const,
    category: 'Salary',
    date: mockDate,
    note: 'Bonus'
  };

  const expenseParams = {
    userId: 'user-123',
    amount: 250000,
    type: 'expense' as const,
    category: 'Food',
    date: mockDate
  };

  it('should initialize correctly with income data', () => {
    const transaction = new Transaction(incomeParams);
    expect(transaction.amount).toBe(1500000);
    expect(transaction.type).toBe('income');
    expect(transaction.category).toBe('Salary');
    expect(transaction.note).toBe('Bonus');
  });

  it('should format amount correctly for income', () => {
    const transaction = new Transaction(incomeParams);
    
    const formatted = transaction.getFormattedAmount();
    expect(formatted).toContain('+');
    expect(formatted).toContain('1.500.000');
  });

  it('should format amount correctly for expense', () => {
    const transaction = new Transaction(expenseParams);
    const formatted = transaction.getFormattedAmount();
    expect(formatted).toContain('-');
    expect(formatted).toContain('250.000');
  });

  it('should serialize to JSON correctly', () => {
    const transaction = new Transaction(incomeParams);
    const json = transaction.toJSON();
    expect(json.amount).toBe(1500000);
    expect(json.date).toBe(mockDate.toISOString());
    expect(typeof json.id).toBe('undefined');
  });
});
