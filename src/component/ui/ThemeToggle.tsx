import { useThemeToggle } from "../../hooks/useThemeToggle";

export default function ThemeToggle() {

  const [isDark, setIsDark] = useThemeToggle() 

  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      onKeyDown={(e) => e.key === 'Enter' && setIsDark(!isDark)}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer ${
        isDark ? 'dark:bg-cyan-400/20' : 'bg-slate-200'
      }`}
    >
      <div 
        className={`w-4 h-4 bg-slate-50/10 border-2 border-blue-950 dark:border-cyan-400 dark:bg-cyan-400 rounded-full shadow-sm transform transition-transform duration-300 ${
          isDark ? 'translate-x-5' : 'translate-x-0'
        }`} 
      />
    </button>
  );
}