import { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";

interface SelectProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  className = "",
}: Readonly<SelectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-2 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-5 rounded-xl bg-slate-100 dark:bg-slate-800/70 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
      >
        <span className="text-slate-900 dark:text-slate-200 font-semibold">
          {value}
        </span>
        <LuChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} size={20} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-xl shadow-2xl z-50 overflow-y-auto max-h-64 animate-in fade-in slide-in-from-top-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-5 py-4 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
