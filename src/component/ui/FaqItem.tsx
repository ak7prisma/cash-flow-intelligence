import { TbChevronDown } from "react-icons/tb";

interface FaqItemProps {
    faq: any, 
    isOpen: boolean, 
    onToggle: () => void 
}

export default function FaqItem({ faq, isOpen, onToggle }: Readonly<FaqItemProps>) {
  return (
    <div className="py-4 first:pt-1 last:pb-1">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left group gap-4"
      >
        <span className={`text-[13px] font-bold transition-colors leading-tight ${
          isOpen ? 'text-teal-800 dark:text-cyan-400' : 'text-blue-950 dark:text-slate-300'
        }`}>
          {faq.question}
        </span>
        <div className={`shrink-0 transition-transform duration-300 ${
          isOpen ? 'text-teal-800 dark:text-cyan-400 rotate-180' : 'text-slate-400'
        }`}>
          <TbChevronDown size={20} />
        </div>
      </button>
      
      {isOpen && (
        <div className="mt-3 pr-6 text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-1">
          {faq.answer}
        </div>
      )}
    </div>
  );
}