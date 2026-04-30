import { Link, useNavigate } from "react-router-dom";
import Button from "../../component/ui/Button";
import Input from "../../component/ui/Input";
import AuthHeader from "../../component/auth/AuthHeader";
import AuthCard from "../../component/auth/AuthCard";
import { FormContainer } from "../../component/auth/FormContainer";
import SocialAuth from "../../component/auth/SocialAuth";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center animate-in fade-in duration-700">
      <AuthHeader 
        title="CREATE ACCOUNT" 
        subtitle="JOIN THE ECOSYSTEM OF ELITE FINANCE" 
      />

      <AuthCard
        footer={
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide">
            Already have an account?{" "}
            <Link to="/auth/Login" className="text-teal-800 dark:text-cyan-400 font-bold hover:underline">
              Log In
            </Link>
          </p>
        }
      >
        <FormContainer>
          <div className="space-y-4">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@company.com"
              className="text-slate-900 dark:text-slate-300"
              inputClassName="order-none text-sm placeholder:text-slate-400"
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="123asd!@#"
              className="text-slate-900 dark:text-slate-300"
              inputClassName="order-none text-sm placeholder:text-slate-400"
              hint="Use 8+ characters with a mix of letters, numbers & symbols."
            />

            <Input 
              label="Confirm Password" 
              type="password" 
              placeholder="••••••••••••"
              className="text-slate-900 dark:text-slate-300"
              inputClassName="order-none text-sm placeholder:text-slate-400"
            />

            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                className="mt-1 w-4 h-4 rounded-3xl dark:bg-slate-900 accent-teal-800 dark:accent-cyan-400  cursor-pointer" 
              />
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed tracking-wide">
                I agree to the{" "}
                <Link to="/profile/privacy" className="text-teal-800 dark:text-cyan-400 font-bold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/profile/privacy" className="text-teal-800 dark:text-cyan-400 font-bold hover:underline">
                  Privacy Protocol
                </Link>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              text="Register" 
              onClick={() => navigate("/")}
              className="h-16 shadow-lg shadow-teal-900/20 dark:shadow-cyan-400/20"
            />

            <SocialAuth />
          </div>
        </FormContainer>
      </AuthCard>
    </div>
  );
}
