import React from "react";
import { RiRobot2Line, RiUser3Line } from "react-icons/ri";

interface ChatBubbleProps {
  type: "bot" | "user";
  message: string | React.ReactNode;
  time: string;
  insight?: {
    title: string;
    content: string;
  };
}

export default function ChatBubble({ type, message, time, insight }: Readonly<ChatBubbleProps>) {
  const isBot = type === "bot";

  return (
    <div className={`flex items-start gap-3 ${isBot ? "flex-row" : "flex-row-reverse"}`}>
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
        isBot 
          ? "bg-blue-950 dark:bg-slate-800 text-cyan-400" 
          : "bg-teal-800 dark:bg-cyan-400 text-white dark:text-slate-900"
      }`}>
        {isBot ? <RiRobot2Line size={20} /> : <RiUser3Line size={20} />}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-2 max-w-[80%] ${!isBot && "items-end"}`}>
        <div className={`p-4 rounded-2xl shadow-sm ${
          isBot 
            ? "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-tl-none text-slate-800 dark:text-slate-100" 
            : "bg-teal-800 dark:bg-cyan-400 text-white dark:text-slate-900 rounded-tr-none"
        }`}>
          <div className="text-[15px] leading-relaxed">
            {message}
          </div>
        </div>

        {/* Insight Box */}
        {isBot && insight && (
          <div className="mt-1 p-4 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800/60 border-l-4 border-teal-600 dark:border-cyan-400">
            <h4 className="text-[10px] font-black text-teal-700 dark:text-cyan-400 tracking-widest mb-1">
              {insight.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {insight.content}
            </p>
          </div>
        )}

        {/* Time */}
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-1 uppercase tracking-wider">
          {time}
        </span>
      </div>
    </div>
  );
}
