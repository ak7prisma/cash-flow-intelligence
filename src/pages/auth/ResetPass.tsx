import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuthActions } from "../../hooks/useAuthActions";
import Button from "../../component/ui/Button";
import Input from "../../component/ui/Input";
import AuthHeader from "../../component/auth/AuthHeader";
import AuthCard from "../../component/auth/AuthCard";
import { FormContainer } from "../../component/auth/FormContainer";
import AlertBanner from "../../component/ui/AlertBanner";

export default function ResetPass() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode") || "";

  const { finalizePasswordReset, loading, error, setError } = useAuthActions();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!oobCode) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    const ok = await finalizePasswordReset(oobCode, newPassword);
    if (ok) setSuccess(true);
  };

  return (
    <div className="flex flex-col items-center justify-center animate-in fade-in duration-700">
      <AuthHeader
        title="RESET PASSWORD"
        subtitle="ENTER YOUR NEW PASSWORD, DON'T FORGET IT AGAIN!"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold text-blue-950 dark:text-white mb-2">
                Password Updated!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
            </div>

            <Button
              text="Back to Login"
              variant="primary"
              to="/auth/Login"
              className="h-16 shadow-lg shadow-teal-900/20 dark:shadow-cyan-400/20"
            />
          </div>
        ) : (
          <FormContainer onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <AlertBanner message={error} />

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••••••"
                hint="Use 8+ characters with a mix of letters, numbers &amp; symbols."
                className="text-slate-900 dark:text-slate-300"
                inputClassName="order-none text-sm placeholder:text-slate-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••••••"
                className="text-slate-900 dark:text-slate-300"
                inputClassName="order-none text-sm placeholder:text-slate-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />

              <Button
                text={loading ? "Resetting..." : "Continue"}
                type="submit"
                disabled={loading}
                className="h-16 shadow-lg shadow-teal-900/20 dark:shadow-cyan-400/20 mt-4"
              />
            </div>
          </FormContainer>
        )}
      </AuthCard>
    </div>
  );
}