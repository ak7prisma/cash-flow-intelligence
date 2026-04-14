 import { movements } from "../../data/dummytester";

export default function RecentMove() {
  return (
    <div className="flex flex-col gap-4">

      <div className="flex justify-between items-center px-1">
        <h2 className="text-blue-950 dark:text-slate-100 font-bold text-base">
          Recent Movements
        </h2>
        <button className="text-teal-700 dark:text-cyan-400 text-sm font-bold uppercase tracking-wider">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {movements.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-50 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.iconBg}`}>
                <item.icon className="text-teal-700 dark:text-cyan-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-blue-950 dark:text-slate-100 text-sm">
                  {item.title}
                </span>
                <span className="text-xs text-slate-400">
                  {item.time}
                </span>
              </div>
            </div>

            <div className={`font-bold text-sm ${
              item.type === "income" 
                ? "text-teal-700 dark:text-cyan-400" 
                : "text-blue-950 dark:text-red-400"
            }`}>
              {item.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}