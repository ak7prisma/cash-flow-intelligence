import { LuCalendar } from "react-icons/lu";
import type { InputHTMLAttributes } from "react";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export default function DateInput({
  label,
  className = "",
  placeholder = "Pilih tanggal",
  value,
  ...props
}: Readonly<DateInputProps>) {
  const hasValue = Boolean(value);

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
          value={value}
          type="date"
          onClick={(e) => {
            props.onClick?.(e);
            try {
              e.currentTarget.showPicker?.();
            } catch {
              // Ignore browser showPicker error
            }
          }}
          className={`w-full h-14 px-5 pr-12 rounded-xl bg-slate-100 dark:bg-slate-800/70 text-slate-900 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-800 dark:focus:ring-cyan-400 transition-all appearance-none cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden border-none ${
            !hasValue ? 'text-transparent [&::-webkit-datetime-edit]:opacity-0' : ''
          }`}
        />
        {!hasValue && (
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium pointer-events-none select-none truncate pr-12">
            {placeholder}
          </span>
        )}
        <LuCalendar className="absolute right-5 top-1/2 -translate-y-1/2 text-teal-600 dark:text-cyan-400 pointer-events-none" size={20} />
      </div>
    </div>
  );
}
