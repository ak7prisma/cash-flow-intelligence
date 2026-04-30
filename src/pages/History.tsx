import { useState } from "react";
import { movements } from "../data/dummytester";
import MovementCard from "../component/History/MovementCard";
import DeleteModals from "../component/modals/DeleteModals";
import EditModals from "../component/modals/EditModals";

export default function History() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filters = ["All", "Income", "Expense"];

  const filteredMovements = movements.filter((item) => {
    if (activeFilter === "All") return true;
    return item.type.toLowerCase() === activeFilter.toLowerCase();
  });

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
        {filteredMovements.map((item) => (
          <MovementCard 
            key={item.id} 
            item={item}
            onDelete={() => handleDeleteClick(item)}
            onEdit={() => handleEditClick(item)}
          />
        ))}
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