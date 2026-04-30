import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      showToast("Access Denied. Please Login first.", "warning");
    }
  }, [user, loading, showToast]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-teal-800/20 dark:border-cyan-400/20 border-t-teal-800 dark:border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/Welcome" replace />;
  }

  return <Outlet />;
};
