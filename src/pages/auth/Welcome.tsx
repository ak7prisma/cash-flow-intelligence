import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { LuSmartphone, LuSparkles } from "react-icons/lu";
import Button from "../../component/ui/Button";

export default function Welcome() {
  return (
    <div className="flex flex-col justify-between gap-25 items-center text-center animate-in fade-in slide-in-from-bottom-8">

      {/* Logo */}
      <div className="flex flex-col items-center">
        <div className="p-5 rounded-full bg-blue-950 dark:bg-slate-950 flex items-center justify-center mb-2 shadow-lg">
          <img src="/LogoCFI.png" alt="Logo CFI" className="w-15 h-15 object-contain brightness-150 dark:brightness-125" />
        </div>
        <h1 className="text-xl font-bold text-blue-950 dark:text-slate-100 tracking-widest leading-tight uppercase">
          Cash Flow <br />
          <span className="opacity-80 text-lg">Intelligence</span>
        </h1>
      </div>

      {/* Hero */}
      <div className="relative w-full flex flex-col items-center justify-center">

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[150px] font-bold tracking-tighter text-slate-900/5 dark:text-white/5 leading-none -translate-y-4">
            2026
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5">
          <h2 className="text-2xl font-bold text-blue-950 dark:text-cyan-400 tracking-wide max-w-[320px] leading-[0.85] uppercase">
            Hello, Smart Spender!
          </h2>
          <p className="text-xs font-bold text-blue-950/40 dark:text-cyan-400/50 tracking-wider max-w-70 uppercase leading-relaxed">
            Ready to see where your money goes today?
          </p>
        </div>
      </div>

      {/* Bottom Group */}
      <div className="w-full flex flex-col items-center px-2">
        {/* Label */}
        <div className="mb-6 inline-flex items-center gap-2 px-6 py-3 bg-teal-950/80 dark:bg-slate-950/50 border border-white/5 dark:border-cyan-400/40 rounded-full text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
          <LuSparkles className="text-cyan-400" />
          Intelligence Ready
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-4 mb-8">
          <Button
            variant="primary"
            text="Login via Email"
            to="/auth/Login"
            icon={<LuSmartphone size={24} />}
            className="bg-teal-800 dark:bg-cyan-400 text-white dark:text-[#071317] shadow-2xl shadow-cyan-500/20"
          />

          <Button
            variant="secondary"
            text="Login via Google"
            icon={<FcGoogle size={24} />}
            className="bg-white/90 dark:bg-slate-50/5  backdrop-blur-xl text-blue-950 dark:text-slate-100"
          />
        </div>

        {/* Privacy */}
        <div className="px-10">
          <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-500 leading-relaxed tracking-widest">
            By continuing, you agree to the{" "}
            <Link to="/profile/privacy" className="text-blue-950 dark:text-[#00F5FF] font-bold transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/profile/privacy" className="text-blue-950 dark:text-[#00F5FF] font-bold transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

    </div>
  );
}

