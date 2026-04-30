import { LuCalendar } from "react-icons/lu";
import type { InputHTMLAttributes } from "react";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export default function DateInput({
  label,
  className = "",
  ...props
}: Readonly<DateInputProps>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
          {label}
        </label>
      )}
      <div className="relative group">
        <input 
          {...props}
          type="date"
          className="w-full h-14 px-5 pr-12 rounded-xl bg-slate-100 dark:bg-slate-800/70 text-slate-900 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-800 dark:focus:ring-cyan-400 transition-all appearance-none cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden border-none"
        />
        <LuCalendar className="absolute right-5 top-1/2 -translate-y-1/2 text-teal-600 dark:text-cyan-400 pointer-events-none" size={20} />
      </div>
    </div>
  );
}
