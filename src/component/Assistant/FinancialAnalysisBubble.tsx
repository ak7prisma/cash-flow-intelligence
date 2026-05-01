import { RiWallet3Line, RiPieChartLine, RiLightbulbFlashLine } from "react-icons/ri";
import type { FinancialAnalysisResponse } from "../../service/gemini";

export default function FinancialAnalysisBubble({ reply }: { readonly reply: FinancialAnalysisResponse }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <div className="p-1.5 bg-teal-100 dark:bg-cyan-900/30 text-teal-600 dark:text-cyan-400 rounded-lg">
          <RiWallet3Line className="text-lg" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-0.5">Status Saldo</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">{reply.status}</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
          <RiPieChartLine className="text-lg" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-0.5">Analisis Belanja</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">{reply.analysis}</p>
        </div>
      </div>
      <div className="flex items-start gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
          <RiLightbulbFlashLine className="text-lg" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-0.5">Saran</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{reply.advice}</p>
        </div>
      </div>
    </div>
  );
}
