import React from "react";

interface SettingCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function SettingCard({ title, children, className = "" }: Readonly<SettingCardProps>) {
  return (
    <section className={className}>
      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-400 tracking-[0.2em] mb-4 uppercase">
        {title}
      </h3>
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        {children}
      </div>
    </section>
  );
}
