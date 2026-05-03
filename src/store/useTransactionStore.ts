import { create } from 'zustand';
import { Transaction } from '../models/Transaction';

interface TransactionState {
  transactions: Transaction[];
  isLoaded: boolean;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  reset: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoaded: false,
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => 
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  reset: () => set({ transactions: [], isLoaded: false }),
}));
