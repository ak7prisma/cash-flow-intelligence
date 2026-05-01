import { Link } from "react-router-dom";
import { Transaction } from "../../models/Transaction";
import { formatIDR } from "../../utils/assistantHelpers";
import { getCategoryIcon } from "../../utils/categoryIcons";

export default function RecentMove({ transactions }: { readonly transactions: Transaction[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-blue-950 dark:text-slate-100 font-bold text-base">
          Recent Movements
        </h2>
        <Link 
          to="/history" 
          className="text-teal-700 dark:text-cyan-400 text-sm font-bold uppercase tracking-wider"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {transactions.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-4">No recent transactions</div>
        ) : (
          transactions.map((item) => {
            const IconComponent = getCategoryIcon(item.category);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-50 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                    <IconComponent className="text-teal-700 dark:text-cyan-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-blue-950 dark:text-slate-100 text-sm capitalize">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className={`font-bold text-sm ${
                  item.type === "income" 
                    ? "text-teal-700 dark:text-cyan-400" 
                    : "text-blue-950 dark:text-red-400"
                }`}>
                  {formatIDR(item.amount)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}