import { useState, useEffect } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import MovementCard from "../component/History/MovementCard";
import DeleteModals from "../component/modals/DeleteModals";
import EditModals from "../component/modals/EditModals";
import { formatIDR } from "../utils/assistantHelpers";
import { getCategoryIcon } from "../utils/categoryIcons";
import { useTransactions } from "../hooks/useTransactions";
import { useTransactionStore } from "../store/useTransactionStore";
import { transactionService } from "../service/TransactionService";

export default function History() {
  const { isLoading, activeFilter, setActiveFilter, filteredMovements } = useTransactions();
  const { transactions, setTransactions } = useTransactionStore();
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const totalPages = Math.ceil(filteredMovements.length / ITEMS_PER_PAGE);
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filters = ["All", "Income", "Expense"];

  const handleDeleteClick = (raw: any, mapped: any) => {
    setSelectedItem({ raw, mapped });
    setIsDeleteOpen(true);
  };

  const handleEditClick = (raw: any, mapped: any) => {
    setSelectedItem({ raw, mapped });
    setIsEditOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem?.raw?.id) return;
    
    const idToDelete = selectedItem.raw.id;
    const previousTransactions = [...transactions];
    
    setTransactions(transactions.filter(tx => tx.id !== idToDelete));
    setIsDeleteOpen(false); 

    try {
      await transactionService.deleteTransaction(idToDelete);
    } catch (error) {
      console.error("Gagal menghapus data di Firestore:", error);
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
      transactions.map(tx => 
        tx.id === idToUpdate ? { ...tx, ...payloadWithoutId } : tx
      )
    );
    setIsEditOpen(false); 

    try {
      await transactionService.updateTransaction(idToUpdate, payloadWithoutId);
    } catch (error) {
      console.error("Gagal mengupdate data di Firestore:", error);
      setTransactions(previousTransactions);
      alert("Gagal menyimpan perubahan. Periksa koneksi internet Anda.");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-xs font-bold tracking-widest text-teal-800 dark:text-cyan-400 uppercase">
          Financial Activity
        </h3>
        <h1 className="text-5xl font-bold text-blue-950 dark:text-slate-100 leading-tight">
          Recent <br /> Movements
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeFilter === filter
                ? "bg-blue-950 text-white dark:bg-cyan-400 dark:text-slate-950 shadow-lg shadow-cyan-400/20"
                : "bg-slate-200/60 text-slate-500 dark:bg-slate-800/40 dark:text-slate-400"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="text-center text-slate-500 font-medium animate-pulse">
              Loading your movements...
            </div>
          </div>
        )}
        {!isLoading && filteredMovements.length === 0 && (
          <div className="text-center py-10 text-slate-500 font-medium">
            No transactions found.
          </div>
        )}
        {!isLoading && filteredMovements.length > 0 && (
          <>
            {paginatedMovements.map((item) => {
              const mappedItem = {
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

              return (
                <MovementCard 
                  key={mappedItem.id} 
                  item={mappedItem as any}
                  onDelete={() => handleDeleteClick(item, mappedItem)}
                  onEdit={() => handleEditClick(item, mappedItem)}
                />
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <LuChevronLeft size={20} />
                  <span className="font-semibold text-sm">Prev</span>
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-950 dark:text-slate-100">
                    {currentPage}
                  </span>
                  <span className="text-xs font-medium text-slate-400">/</span>
                  <span className="text-xs font-medium text-slate-400">
                    {totalPages}
                  </span>
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <span className="font-semibold text-sm">Next</span>
                  <LuChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {selectedItem && (
        <>
          <DeleteModals 
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onDelete={handleConfirmDelete}
            itemName={selectedItem.mapped?.title}
            itemAmount={selectedItem.mapped?.amount}
          />
          <EditModals 
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleConfirmEdit}
            item={selectedItem.mapped}
            rawItem={selectedItem.raw}
          />
        </>
      )}
    </div>
  );
}