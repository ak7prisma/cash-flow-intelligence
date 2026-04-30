import { LuPencil, LuTrash2 } from "react-icons/lu";

interface MovementCardProps {
  item: {
    id: number;
    title: string;
    subtitle: string;
    time: string;
    amount: string;
    type: string;
    icon: any;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MovementCard({ item, onEdit, onDelete }: Readonly<MovementCardProps>) {
  return (
    <div
      className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/40 backdrop-blur-sm p-5 rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all duration-300"
    >
      {/* Background Icon */}
      <div className="absolute right-25 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <item.icon size={140} />
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        {/* Title & Actions */}
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-blue-950 dark:text-slate-100 text-lg tracking-tight leading-none">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 rounded-lg group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="text-slate-400 hover:text-teal-600 dark:hover:text-cyan-400 transition-colors p-1"
            >
              <LuPencil size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <LuTrash2 size={14} />
            </button>
          </div>
        </div>

        {/* Detail/Time & Amount */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {item.subtitle}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {item.time}
            </span>
          </div>
          <div
            className={`font-bold text-lg ${
              item.type === "income"
                ? "text-teal-800 dark:text-cyan-400"
                : "text-blue-950 dark:text-slate-100"
            }`}
          >
            {item.amount}
          </div>
        </div>
      </div>
    </div>
  );
}
