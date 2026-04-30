import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FormContainer } from "../../component/auth/FormContainer";
import Input from "../../component/ui/Input";
import Button from "../../component/ui/Button";
import AuthHeader from "../../component/auth/AuthHeader";
import AuthCard from "../../component/auth/AuthCard";

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
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide">
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

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 tracking-widest uppercase whitespace-nowrap">OR SIGN IN WITH</span>
              <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
            </div>

            <Button 
              text="Google" 
              variant="secondary"
              onClick={() => alert("Google Sign-In coming soon!")}
              icon={<FcGoogle size={24} />}
              justify="center"
              showIconBg={false}
              iconPosition="left"
            />
          </div>
        </FormContainer>
      </AuthCard>
    </div>
  );
}