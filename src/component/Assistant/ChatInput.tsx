import { RiMicLine, RiSendPlane2Line } from "react-icons/ri";

export default function ChatInput() {
  return (
    <div className="fixed bottom-22 left-0 right-0 px-5 z-40 animate-in slide-in-from-bottom-5 duration-500">
      <div className="max-w-2xl mx-auto flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none backdrop-blur-md">
        <button className="p-3 text-slate-500 dark:text-slate-400 transition-colors">
          <RiMicLine size={22} />
        </button>
        
        <input 
          type="text" 
          placeholder="Ask Gemini to log an expense..."
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 py-2"
        />

        <button className="w-12 h-12 flex items-center justify-center bg-teal-800 dark:bg-cyan-400 text-white dark:text-slate-900 rounded-2xl shadow-lg shadow-teal-500/20 dark:shadow-cyan-500/20 active:scale-95 transition-all">
          <RiSendPlane2Line size={20} />
        </button>
      </div>
    </div>
  );
}
