import { RiRobot2Line } from "react-icons/ri";
import { TbLoader2 } from "react-icons/tb";

interface InsightCardProps {
  insight: string;
  isLoading: boolean;
}

export default function InsightCard({ insight, isLoading }: Readonly<InsightCardProps>) {
  return (
    <div className="relative mt-4">
      <div className="absolute -top-3 left-6 flex items-center gap-1.5 bg-teal-800 dark:bg-slate-900/40 dark:border-2 dark:border-cyan-400 text-cyan-300 px-3 py-1 rounded-full text-[10px] font-medium tracking-wider z-10 shadow-sm">
        <RiRobot2Line className="text-base" />
        GEMINI INTELLIGENCE
      </div>

      <div className="bg-slate-50/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 pt-8 shadow-sm min-h-[100px] flex items-center">
        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 w-full">
            <TbLoader2 className="animate-spin text-xl text-cyan-600 dark:text-cyan-400" />
            <p className="text-sm font-medium animate-pulse">Memanggil Gemini AI...</p>
          </div>
        ) : (
          <p className="text-base sm:text-lg leading-relaxed font-medium text-slate-800 dark:text-slate-200">
            {insight}
          </p>
        )}
      </div>
    </div>
  );
}