import { useState, useEffect, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuInfo, LuX } from "react-icons/lu";
import { GoAlertFill, GoCheckCircleFill } from "react-icons/go";

type ToastType = "info" | "success" | "warning" | "error";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success": return <GoCheckCircleFill className="text-emerald-500" />;
      case "warning": return <GoAlertFill className="text-amber-500" />;
      case "error": return <LuX className="text-red-500" />;
      default: return <LuInfo className="text-cyan-400" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-9999 px-6 py-4 rounded-2xl bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl border border-white/10 dark:border-cyan-400/20 shadow-2xl flex items-center gap-4 min-w-75"
          >
            <div className="text-2xl">{getIcon(toast.type)}</div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
