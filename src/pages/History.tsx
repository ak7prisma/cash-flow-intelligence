import MovementCard from "../component/History/MovementCard";
import DeleteModals from "../component/modals/DeleteModals";
import EditModals from "../component/modals/EditModals";
import DateInput from "../component/ui/DateInput";
import FilterTabs from "../component/ui/FilterTabs";
import Pagination from "../component/ui/Pagination";
import Select from "../component/ui/Select";
import { useHistoryPage } from "../hooks/useHistoryPage";

const FILTERS = ["All", "Income", "Expense"];

export default function History() {
  const {
    isLoading,
    activeFilter,
    setActiveFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    category,
    setCategory,
    categoryOptions,
    resetFilters,
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
  } = useHistoryPage();

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-xs font-bold tracking-widest text-teal-800 dark:text-cyan-400 uppercase">
          Financial Activity
        </h3>
        <h1 className="text-5xl font-bold text-blue-950 dark:text-slate-100 leading-tight">
          Recent <br /> Movements
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <FilterTabs
          filters={FILTERS}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="grid grid-cols-2 gap-3">
          <DateInput
            label="From"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(event) => setDateFrom(event.target.value)}
          />
          <DateInput
            label="To"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(event) => setDateTo(event.target.value)}
          />
        </div>

        <div className="flex items-end gap-3">
          <Select
            label="Category"
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            className="flex-1"
          />
          <button
            type="button"
            onClick={resetFilters}
            className="h-14 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/40 active:scale-[0.99] transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Transaction List */}
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
            {paginatedMovements.map(({ raw, mapped }) => (
              <MovementCard
                key={mapped.id}
                item={mapped as any}
                onDelete={() => openDeleteModal(raw, mapped)}
                onEdit={() => openEditModal(raw, mapped)}
              />
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
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