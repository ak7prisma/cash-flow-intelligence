export const VARIANT_CONFIGS = {
  primary: {
    container: "h-18 bg-teal-800 dark:bg-cyan-400 text-slate-50 dark:text-slate-950 px-6 rounded-xl",
    icon: "p-3 bg-white/10 dark:bg-cyan-800/30 rounded-2xl ml-2",
    text: "text-lg font-semibold",
  },
  secondary: {
    container: "h-18 text-teal-800 bg-slate-50 dark:bg-slate-50/5 dark:text-cyan-400 px-6 rounded-xl border border-teal-800/20 dark:border-cyan-400/20",
    icon: "w-10 h-10 bg-teal-800/10 dark:bg-cyan-400/10 rounded-xl ml-2",
    text: "text-lg font-semibold",
  },
  ghost: {
    container: "py-2 text-blue-950 dark:text-slate-50 tracking-widest uppercase",
    icon: "ml-2",
    text: "text-sm font-semibold",
  },
} as const;