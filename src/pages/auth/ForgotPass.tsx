import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthActions } from "../../hooks/useAuthActions";
import Button from "../../component/ui/Button";
import Input from "../../component/ui/Input";
import AuthHeader from "../../component/auth/AuthHeader";
import AuthCard from "../../component/auth/AuthCard";
import { FormContainer } from "../../component/auth/FormContainer";
import AlertBanner from "../../component/ui/AlertBanner";

export default function ForgotPass() {
  const { resetPasswordEmail, loading, error, setError } = useAuthActions();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetEmail = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const ok = await resetPasswordEmail(email);
    if (ok) setSuccess(true);
  };

  return (
    <div className="flex flex-col items-center justify-center animate-in fade-in duration-700">
      <AuthHeader
        title="FORGOT PASSWORD"
        subtitle="ENTER YOUR ACTIVE EMAIL ACCOUNT"
      />

      <AuthCard
        footer={
          <p className="text-xs font-base text-slate-600 dark:text-slate-400 tracking-wide">
            Remember your password?{" "}
            <Link to="/auth/Login" className="text-teal-800 dark:text-cyan-400 font-bold hover:underline">
              Log In
            </Link>
          </p>
        }
      >
        {success ? (
          <div className="space-y-5 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold text-blue-950 dark:text-white mb-2">
                Check Your Inbox
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We've sent a password reset link to{" "}
                <span className="font-semibold text-teal-800 dark:text-cyan-400">{email}</span>.
                Please check your inbox and follow the instructions.
              </p>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => { setSuccess(false); setEmail(""); }}
                className="text-teal-800 dark:text-cyan-400 font-bold hover:underline"
              >
                try again
              </button>.
            </p>
          </div>
        ) : (
          <FormContainer onSubmit={handleResetEmail}>
            <div className="space-y-6">
              <AlertBanner message={error} />

              <Input
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                className="text-slate-900 dark:text-slate-300"
                inputClassName="order-none text-sm placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <Button
                text={loading ? "Sending..." : "Continue"}
                type="submit"
                disabled={loading}
                className="h-16 shadow-lg shadow-teal-900/20 dark:shadow-cyan-400/20 mt-2"
              />
            </div>
          </FormContainer>
        )}
      </AuthCard>
    </div>
  );
}