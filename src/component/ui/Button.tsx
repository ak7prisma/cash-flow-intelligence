interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({ text, variant = "primary" }: Readonly<ButtonProps>) {

  if (variant === "ghost") {
    return (
      <button 
        type="button"
        className="w-full text-center py-2 text-blue-950 dark:text-slate-50 font-bold text-sm tracking-widest uppercase"
      >
        {text}
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button 
        type="button"
        className="w-full h-16 rounded-xl border-2 border-teal-800 dark:border-cyan-400 text-teal-800 dark:text-cyan-400 font-semibold text-md"
      >
        {text}
      </button>
    );
  }

  return (
    <button 
      type="button"
      className="w-full h-16 rounded-xl bg-teal-800 dark:bg-cyan-400 text-slate-50 dark:text-slate-950 font-semibold text-md"
    >
      {text}
    </button>
  );
}