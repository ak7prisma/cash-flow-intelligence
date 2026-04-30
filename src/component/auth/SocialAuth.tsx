import { FcGoogle } from "react-icons/fc";
import Button from "../ui/Button";

interface SocialAuthProps {
  label?: string;
}

export default function SocialAuth({ label = "OR SIGN IN WITH" }: SocialAuthProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 tracking-widest uppercase whitespace-nowrap">
          {label}
        </span>
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
        className="text-blue-950 dark:text-slate-100"
      />
    </div>
  );
}
