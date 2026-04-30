import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({ children, footer }: Readonly<AuthCardProps>) {
  return (
    <div className="w-full bg-slate-50/20 dark:bg-slate-950/20 rounded-2xl p-8 shadow-2xl shadow-slate-900/50 dark:shadow-none border border-slate-100/50 dark:border-white/5 relative z-10">
      {children}
      {footer && (
        <div className="mt-8 text-center">
          {footer}
        </div>
      )}
    </div>
  );
}
