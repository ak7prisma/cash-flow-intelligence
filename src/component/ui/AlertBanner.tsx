interface AlertBannerProps {
  message: string | null;
  variant?: "error" | "success";
}

const VARIANT_STYLES = {
  error: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
};

export default function AlertBanner({ message, variant = "error" }: Readonly<AlertBannerProps>) {
  if (!message) return null;

  return (
    <div className={`px-4 py-3 rounded-xl border text-xs font-medium tracking-wide animate-in fade-in slide-in-from-top-2 duration-300 ${VARIANT_STYLES[variant]}`}>
      {message}
    </div>
  );
}
