import { useNavigate } from "react-router-dom";
import { useAuthActions } from "./useAuthActions";

export function useGoogleAuth() {
  const navigate = useNavigate();
  const authActions = useAuthActions();

  const handleGoogleLogin = async () => {
    const success = await authActions.loginWithGoogle();
    if (success) {
      setTimeout(() => {
        navigate("/", { replace: true });
        setTimeout(() => {
          if (globalThis.location.pathname.includes("/auth")) {
            globalThis.location.href = "/";
          }
        }, 500);
      }, 100);
    }
  };

  return {
    ...authActions,
    handleGoogleLogin,
  };
}
