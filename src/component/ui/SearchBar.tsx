import { IoSearchOutline } from 'react-icons/io5';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: Readonly<SearchBarProps>) {
  return (
    <div className="relative group">
      <IoSearchOutline
        className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 group-focus-within:text-teal-800 dark:group-focus-within:text-cyan-400 transition-colors" 
      />
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-4 pl-12 pr-4 rounded-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-800 dark:focus:ring-cyan-400 transition-all text-blue-950 dark:text-slate-100 placeholder:text-slate-400 shadow-sm"
      />
    </div>
  );
}