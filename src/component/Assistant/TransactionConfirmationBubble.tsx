import { RiCheckLine, RiStickyNoteLine, RiSparkling2Line } from "react-icons/ri";

interface TransactionConfirmationBubbleProps {
  type: "income" | "expense";
  amountFormatted: string;
  category: string;
  note?: string;
}

export default function TransactionConfirmationBubble({
  type,
  amountFormatted,
  category,
  note,
}: Readonly<TransactionConfirmationBubbleProps>) {
  const typeLabel = type === "income" ? "Income" : "Expense";
  
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 flex-wrap">
        Sip, <span className="font-bold">{typeLabel}</span> sebesar{" "}
        <span className="font-bold text-teal-800 dark:text-cyan-400">
          {amountFormatted}
        </span>{" "}
        sudah dicatat ke kategori{" "}
        <span className="font-bold text-teal-800 dark:text-cyan-400">
          {category}
        </span>
        ! <RiCheckLine className="text-teal-600 dark:text-cyan-400 text-lg" />
      </p>
      {note && (
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <RiStickyNoteLine /> Catatan: {note}
        </p>
      )}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 dark:bg-cyan-400/10 border border-teal-500/20 dark:border-cyan-400/20 text-[10px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-widest">
        <RiSparkling2Line size={12} className="animate-pulse" />
        Logged Successfully
      </div>
    </div>
  );
}
