import { Link, useNavigate } from "react-router-dom";
import Button from "../../component/ui/Button";
import Input from "../../component/ui/Input";
import AuthHeader from "../../component/auth/AuthHeader";
import AuthCard from "../../component/auth/AuthCard";

export default function ResetPass() {
  const navigate = useNavigate();

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
        <div className="space-y-4">
          <Input 
            label="New Password" 
            type="password" 
            placeholder="••••••••••••" 
            hint="Use 8+ characters with a mix of letters, numbers & symbols."
            className="text-slate-900 dark:text-slate-300"
              inputClassName="order-none text-sm placeholder:text-slate-400"
          />
          
          <Input 
            label="Confirm Password" 
            type="password" 
            placeholder="••••••••••••"
            className="text-slate-900 dark:text-slate-300"
              inputClassName="order-none text-sm placeholder:text-slate-400"
          />

          <Button 
            text="Continue" 
            onClick={() => navigate("/auth/Login")}
            className="h-16 shadow-lg shadow-teal-900/20 dark:shadow-cyan-400/20 mt-4"
          />
        </div>
      </AuthCard>
    </div>
  );
}