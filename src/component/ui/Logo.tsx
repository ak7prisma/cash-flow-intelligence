interface LogoProps {
  showText?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ showText = true, className = "", size = "md" }: Readonly<LogoProps>) {
  const iconSizes = {
    sm: "w-10 h-10 p-3",
    md: "w-24 h-24 p-5",
    lg: "w-32 h-32 p-7"
  };

  const imgSizes = {
    sm: "w-6 h-6",
    md: "w-15 h-15",
    lg: "w-20 h-20"
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`${iconSizes[size]} rounded-full bg-blue-950 dark:bg-slate-950 flex items-center justify-center mb-2 shadow-lg`}>
        <img 
          src="/LogoCFI.png" 
          alt="Logo CFI" 
          className={`${imgSizes[size]} object-contain brightness-150 dark:brightness-125`} 
        />
      </div>
      {showText && (
        <h1 className="text-xl font-bold text-blue-950 dark:text-slate-100 tracking-widest leading-tight uppercase">
          Cash Flow <br />
          <span className="opacity-80 text-lg">Intelligence</span>
        </h1>
      )}
    </div>
  );
}
