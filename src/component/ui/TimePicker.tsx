import { useRef } from "react";
import { IoTimeOutline } from "react-icons/io5";

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

export default function TimePicker({ label, value, onChange, hint }: Readonly<TimePickerProps>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.();
      inputRef.current.focus();
    }
  };

  return (
    <div className="text-slate-500 dark:text-slate-400 my-2">
      <label className="block text-sm font-medium mb-2 tracking-wide uppercase">
        {label}
      </label>
      <button 
        className="relative group cursor-pointer w-full text-left bg-transparent border-none p-0"
        onClick={handleContainerClick}
        type="button"
      >
        
        <div className="w-full h-14 px-5 rounded-xl bg-slate-50 dark:bg-slate-950/40 text-lg flex items-center justify-between border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all">
          <span className="text-blue-950 dark:text-white font-medium">
            {value || "Set Time"}
          </span>
          <IoTimeOutline className="text-slate-400 group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors" size={22} />
        </div>

        <input
          ref={inputRef}
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          style={{ colorScheme: 'dark' }}
        />
      </button>
      {hint && <p className="text-xs mt-2 block">{hint}</p>}
    </div>
  );
}
