import { frequencyOptions } from "../../data/frequency";

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function FrequencyRadio({ label, value, onChange }: Readonly<RadioGroupProps>) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-4 uppercase">
        {label}
      </h3>
      <div className="space-y-2">
        {frequencyOptions.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`w-full flex items-center rounded-lg gap-4 p-4 transition-all duration-300 text-left ${
                isActive
                  ? "bg-teal-800 dark:bg-cyan-400/10 shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/40"
              }`}
            >
              {/* Icon Container */}
              <div className={`p-3 rounded-xl transition-colors dark:text-cyan-400 ${
                isActive
                  ? "bg-slate-50/20 dark:bg-slate-950/50 text-white" 
                  : "bg-teal-50 dark:bg-cyan-950/30 text-teal-800 dark:text-cyan-400"
              }`}>
                <option.icon className="w-5 h-5"/>
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h4 className={`font-bold text-lg leading-tight transition-colors ${
                  isActive ? "text-white" : "text-blue-950 dark:text-slate-100"
                }`}>
                  {option.label}
                </h4>
                <p className={`text-sm transition-colors ${
                  isActive ? "text-teal-100/80" : "text-slate-500 dark:text-slate-400"
                }`}>
                  {option.description}
                </p>
              </div>

              {/* Radio Circle */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isActive 
                  ? "border-3 border-teal-100 dark:border-cyan-400" 
                  : "border-slate-300 dark:border-slate-700 bg-transparent"
              }`}>
                {isActive && (
                  <div className="p-1 rounded-full bg-teal-100 dark:bg-cyan-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
