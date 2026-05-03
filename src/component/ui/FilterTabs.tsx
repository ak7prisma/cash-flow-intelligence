interface FilterTabsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterTabs({ filters, activeFilter, onFilterChange }: Readonly<FilterTabsProps>) {
  return (
    <div className="flex gap-2 px-1">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
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
  );
}
