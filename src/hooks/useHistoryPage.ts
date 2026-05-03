import { useState, useEffect, useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { useTransactionStore } from "../store/useTransactionStore";
import { transactionService } from "../service/TransactionService";
import { formatIDR } from "../utils/assistantHelpers";
import { getCategoryIcon } from "../utils/categoryIcons";

const ITEMS_PER_PAGE = 10;

export interface MappedMovement {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  amount: string;
  type: string;
  icon: any;
}

function mapTransaction(item: any): MappedMovement {
  return {
    id: item.id || Math.random().toString(),
    title: item.category,
    subtitle: item.note || item.category,
    time: item.date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    amount: formatIDR(item.amount),
    type: item.type,
    icon: getCategoryIcon(item.category),
  };
}

export function useHistoryPage() {
  const { isLoading, activeFilter, setActiveFilter, filteredMovements } = useTransactions();
  const { transactions, setTransactions } = useTransactionStore();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ raw: any; mapped: MappedMovement } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const totalPages = Math.ceil(filteredMovements.length / ITEMS_PER_PAGE);

  const paginatedMovements = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMovements.slice(start, start + ITEMS_PER_PAGE).map((item) => ({
      raw: item,
      mapped: mapTransaction(item),
    }));
  }, [filteredMovements, currentPage]);

  const openDeleteModal = (raw: any, mapped: MappedMovement) => {
    setSelectedItem({ raw, mapped });
    setIsDeleteOpen(true);
  };

  const openEditModal = (raw: any, mapped: MappedMovement) => {
    setSelectedItem({ raw, mapped });
    setIsEditOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem?.raw?.id) return;

    const idToDelete = selectedItem.raw.id;
    const previousTransactions = [...transactions];

    setTransactions(transactions.filter((tx) => tx.id !== idToDelete));
    setIsDeleteOpen(false);

    try {
      await transactionService.deleteTransaction(idToDelete);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      setTransactions(previousTransactions);
      alert("Gagal menghapus transaksi. Periksa koneksi internet Anda.");
    }
  };

  const handleConfirmEdit = async (updatedData: any) => {
    if (!selectedItem?.raw?.id) return;

    const idToUpdate = selectedItem.raw.id;
    const previousTransactions = [...transactions];
    const { id, ...payloadWithoutId } = updatedData;

    setTransactions(
      transactions.map((tx) =>
        tx.id === idToUpdate ? { ...tx, ...payloadWithoutId } : tx
      )
    );
    setIsEditOpen(false);

    try {
      await transactionService.updateTransaction(idToUpdate, payloadWithoutId);
    } catch (error) {
      console.error("Failed to update transaction:", error);
      setTransactions(previousTransactions);
      alert("Gagal menyimpan perubahan. Periksa koneksi internet Anda.");
    }
  };

  return {
    isLoading,
    activeFilter,
    setActiveFilter,
    filteredMovements,
    paginatedMovements,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedItem,
    isDeleteOpen,
    setIsDeleteOpen,
    isEditOpen,
    setIsEditOpen,
    openDeleteModal,
    openEditModal,
    handleConfirmDelete,
    handleConfirmEdit,
  };
}
