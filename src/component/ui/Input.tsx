import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  className?: string;
  inputClassName?: string;
  rightLabel?: React.ReactNode;
}

export default function Input({
  label,
  type = "text",
  placeholder,
  hint,
  className = "",
  inputClassName = "",
  rightLabel,
}: Readonly<FormInputProps>) {
  const isPassword = type === "password";
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`text-slate-500 dark:text-slate-400 ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium tracking-wide">
            {label}
          </label>
          {rightLabel}
        </div>
      )}
      <div className="relative">
        <input
          type={isPassword && isActive ? "text" : type}
          placeholder={placeholder}
          className={`w-full h-14 px-5 rounded-xl bg-[#EEEEEF] dark:bg-slate-950/40 text-lg focus:ring-2 focus:ring-teal-800 dark:focus:ring-cyan-400 focus:outline-none transition-colors ${
            isPassword ? "pr-14" : "pr-5"
          } ${inputClassName}`}
        />

        {isPassword && (
          <button
            type="button"
            className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <IoEyeOutline size={24} /> : <IoEyeOffOutline size={24} />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs mt-2 block">{hint}</p>}
    </div>
  );
}