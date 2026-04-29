interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

export default function Toggle({ enabled, onChange, label }: Readonly<ToggleProps>) {
  return (
    <div className="flex items-center justify-between py-2">
      {label && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          enabled ? "bg-teal-800/40 dark:bg-cyan-400/20" : "bg-slate-300 dark:bg-slate-700"
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <div
          aria-hidden="true"
          className={`h-5 w-5 items-center transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "bg-teal-800 dark:bg-cyan-400 translate-x-5" : "border-2 border-slate-700 translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
