import { VscRobot } from "react-icons/vsc";

export default function InsightCard() {
  return (
    <div className="relative mt-4">
      <div className="absolute -top-3 left-6 flex items-center gap-1.5 bg-teal-800 dark:bg-slate-900/40 dark:border-2 dark:border-cyan-400 text-cyan-300 px-3 py-1 rounded-full text-[10px] font-medium tracking-wider z-10 shadow-sm">
        <VscRobot className="text-base" />
        GEMINI INTELLIGENCE
      </div>

      <div className="bg-slate-50/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 pt-8 shadow-sm">
        <p className="text-lg leading-relaxed font-medium text-slate-800 dark:text-slate-200">
          Spending analysis:{" "}
          <span className="text-red-600 dark:text-red-400 font-semibold">
            fast food costs are up 20%
          </span>{" "}
          this week. Set a Rp 100k daily budget to save{" "}
          <span className="text-teal-700 dark:text-[#00F5FF] font-bold">
            Rp 150k potential!
          </span>
        </p>
      </div>
    </div>
  );
}