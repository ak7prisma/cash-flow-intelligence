import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { LuSmartphone, LuSparkles } from "react-icons/lu";
import { useAuthActions } from "../../hooks/useAuthActions";
import Button from "../../component/ui/Button";
import Logo from "../../component/ui/Logo";

export default function Welcome() {
  const navigate = useNavigate();
  const { loginWithGoogle, handleRedirectCallback, loading } = useAuthActions();

  // Check for redirect result when page loads
  useEffect(() => {
    handleRedirectCallback(() => navigate("/"));
  }, [handleRedirectCallback, navigate]);

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="flex flex-col justify-between gap-25 items-center text-center animate-in fade-in slide-in-from-bottom-8">

      {/* Logo */}
      <Logo className="mt-4" />

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
            disabled={loading}
          />

          <Button
            variant="secondary"
            text={loading ? "Connecting..." : "Login via Google"}
            icon={<FcGoogle size={24} />}
            onClick={handleGoogleLogin}
            disabled={loading}
          />
        </div>

        {/* Privacy */}
        <div className="px-10">
          <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-500 leading-relaxed tracking-widest uppercase">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

    </div>
  );
}
