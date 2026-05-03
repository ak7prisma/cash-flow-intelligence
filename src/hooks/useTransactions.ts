import { useState, useEffect, useMemo, useRef } from "react";
import { transactionService } from "../service/TransactionService";
import { useAuth } from "../context/AuthContext";
import { useTransactionStore } from "../store/useTransactionStore";

export function useTransactions() {
  const { user } = useAuth();
  const { transactions, isLoaded, setTransactions, setIsLoaded, reset } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(!isLoaded);
  const [activeFilter, setActiveFilter] = useState("All");
  const prevUidRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUid = user?.uid ?? null;

    if (prevUidRef.current !== null && currentUid !== prevUidRef.current) {
      reset();
    }
    prevUidRef.current = currentUid;

    if (user && !isLoaded) {
      setIsLoading(true);
      transactionService.getTransactionsByUser(user.uid)
        .then((data) => {
          setTransactions(data);
          setIsLoaded(true);
        })
        .catch((err) => console.error("Error fetching transactions:", err))
        .finally(() => setIsLoading(false));
    } else if (isLoaded) {
      setIsLoading(false);
    }
  }, [user, isLoaded, setTransactions, setIsLoaded, reset]);

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
