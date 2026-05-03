import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useAuth } from "../../context/AuthContext";
import Button from "../../component/ui/Button";
import Input from "../../component/ui/Input";
import AuthHeader from "../../component/auth/AuthHeader";
import AuthCard from "../../component/auth/AuthCard";
import { FormContainer } from "../../component/auth/FormContainer";
import SocialAuth from "../../component/auth/SocialAuth";
import AlertBanner from "../../component/ui/AlertBanner";

export default function Register() {
  const navigate = useNavigate();
  const { register, handleRedirectCallback, handleGoogleLogin, loading, error, setError } = useGoogleAuth();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    handleRedirectCallback(() => navigate("/"));
  }, [handleRedirectCallback, navigate]);

  const handleRegister = async () => {
    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Protocol.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const success = await register(email, password);
    if (success) navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center animate-in fade-in duration-700">
      <AuthHeader
        title="CREATE ACCOUNT"
        subtitle="JOIN THE ECOSYSTEM OF ELITE FINANCE"
      />

      <AuthCard
        footer={
          <p className="text-xs font-base text-slate-600 dark:text-slate-400 tracking-wide">
            Already have an account?{" "}
            <Link to="/auth/Login" className="text-teal-800 dark:text-cyan-400 font-bold hover:underline">
              Log In
            </Link>
          </p>
        }
      >
        <FormContainer onSubmit={handleRegister}>
          <div className="space-y-4">
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

            <Input
              label="Password"
              type="password"
              placeholder="123asd!@#"
              className="text-slate-900 dark:text-slate-300"
              inputClassName="order-none text-sm placeholder:text-slate-400"
              hint="Use 8+ characters with a mix of letters, numbers &amp; symbols."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
                className="mt-1 w-4 h-4 rounded-3xl dark:bg-slate-900 accent-teal-800 dark:accent-cyan-400  cursor-pointer"
              />
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed tracking-wide">
                I agree to the{" "}
                <Link to="/auth/privacy" className="text-teal-800 dark:text-cyan-400 font-bold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/auth/privacy" className="text-teal-800 dark:text-cyan-400 font-bold hover:underline">
                  Privacy Protocol
                </Link>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              text={loading ? "Processing..." : "Register"}
              type="submit"
              disabled={loading}
              className="h-16 shadow-lg shadow-teal-900/20 dark:shadow-cyan-400/20"
            />

            <SocialAuth
              onGoogleClick={handleGoogleLogin}
              loading={loading}
            />
          </div>
        </FormContainer>
      </AuthCard>
    </div>
  );
}