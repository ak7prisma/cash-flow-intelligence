import { useState } from "react";
import MovementCard from "../component/History/MovementCard";
import DeleteModals from "../component/modals/DeleteModals";
import EditModals from "../component/modals/EditModals";
import { formatIDR } from "../utils/assistantHelpers";
import { getCategoryIcon } from "../utils/categoryIcons";
import { useTransactions } from "../hooks/useTransactions";

export default function History() {
  const { isLoading, activeFilter, setActiveFilter, filteredMovements } = useTransactions();
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filters = ["All", "Income", "Expense"];

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setIsEditOpen(true);
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
            {filteredMovements.map((item) => {
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
                  onDelete={() => handleDeleteClick(item)}
                  onEdit={() => handleEditClick(item)}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Modals */}
      {selectedItem && (
        <>
          <DeleteModals 
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onDelete={() => console.log("Deleting", selectedItem.id)}
            itemName={selectedItem.title}
            itemAmount={selectedItem.amount}
          />
          <EditModals 
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={(data) => console.log("Saving", data)}
            item={selectedItem}
          />
        </>
      )}
    </div>
  );
}