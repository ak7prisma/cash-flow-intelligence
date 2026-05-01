import { RiRobot2Line } from "react-icons/ri";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 opacity-80 animate-in fade-in duration-300">
      <div className="w-10 h-10 rounded-xl bg-blue-950 dark:bg-slate-800 flex items-center justify-center text-cyan-400 shadow-sm">
        <RiRobot2Line size={22} />
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center h-10">
         <div className="w-1.5 h-1.5 bg-teal-700/70 dark:bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
         <div className="w-1.5 h-1.5 bg-teal-700/70 dark:bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
         <div className="w-1.5 h-1.5 bg-teal-700/70 dark:bg-cyan-500/70 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
      </div>
    </div>
  );
}
