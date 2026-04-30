import { useNavigate, Link } from "react-router-dom";
import { FormContainer } from "../../component/auth/FormContainer";
import Input from "../../component/ui/Input";
import Button from "../../component/ui/Button";
import AuthHeader from "../../component/auth/AuthHeader";
import AuthCard from "../../component/auth/AuthCard";
import SocialAuth from "../../component/auth/SocialAuth";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center animate-in fade-in duration-700">
      <AuthHeader 
        title="WELCOME BACK!" 
        subtitle="ACCESS YOUR INTELLIGENCE DASHBOARD" 
      />

      <AuthCard
        footer={
          <p className="text-xs font-base text-slate-600 dark:text-slate-400 tracking-wide">
            Don't have an account?{" "}
            <Link to="/auth/Register" className="text-teal-800 dark:text-cyan-400 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        }
      >
        <FormContainer>
          <div className="space-y-4 text-left">
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
              placeholder="••••••••••••" 
              className="text-slate-900 dark:text-slate-300"
              inputClassName="order-none text-sm"
              rightLabel={
                <Link to="/auth/ForgotPass" className="text-xs font-bold text-teal-800 dark:text-cyan-400 hover:underline">
                  Forgot Password?
                </Link>
              }
            />
          </div>

          <div className="space-y-4">
            <Button 
              text="Continue"
              variant="primary"
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