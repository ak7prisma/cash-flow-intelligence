import { useState, useEffect, useMemo } from "react";
import { transactionService } from "../service/TransactionService";
import { Transaction } from "../models/Transaction";
import { useAuth } from "../context/AuthContext";

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      transactionService.getTransactionsByUser(user.uid)
        .then((data) => setTransactions(data))
        .catch((err) => console.error("Error fetching transactions:", err))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const filteredMovements = useMemo(() => {
    return transactions.filter((item) => {
      if (activeFilter === "All") return true;
      return item.type.toLowerCase() === activeFilter.toLowerCase();
    });
  }, [transactions, activeFilter]);

  return {
    transactions,
    isLoading,
    activeFilter,
    setActiveFilter,
    filteredMovements
  };
}
