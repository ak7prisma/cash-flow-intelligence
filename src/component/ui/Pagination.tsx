import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Readonly<PaginationProps>) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <span className="font-semibold text-sm">Next</span>
        <LuChevronRight size={20} />
      </button>
    </div>
  );
}
