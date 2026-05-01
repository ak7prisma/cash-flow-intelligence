import { create } from 'zustand';
import { Transaction } from '../models/Transaction';

interface TransactionState {
  transactions: Transaction[];
  isLoaded: boolean;
  setTransactions: (transactions: Transaction[]) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoaded: false,
  setTransactions: (transactions) => set({ transactions }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}));
