import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect, useState, lazy, Suspense } from "react";
import ShutterSplashScreen from "./component/ui/ShutterSplashScreen";
import { setupDailyNotification } from "./utils/notifications";
import { useSettingsStore } from "./store/useSettingsStore";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./component/auth/ProtectedRoute";
import { ToastProvider } from "./component/ui/Toast";

// Layouts
const MainLayout = lazy(() => import("./layout/MainLayout"));
const AuthLayout = lazy(() => import("./layout/AuthLayout"));
const ProfileLayout = lazy(() => import("./layout/ProfileLayout"));

// Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Profile = lazy(() => import("./pages/Profile"));
const History = lazy(() => import("./pages/History"));

// Auth Pages
const Welcome = lazy(() => import("./pages/auth/Welcome"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPass = lazy(() => import("./pages/auth/ForgotPass"));
const ResetPass = lazy(() => import("./pages/auth/ResetPass"));
const Privacy = lazy(() => import("./pages/auth/Privacy"));

// Profile Pages
const SecuritySet = lazy(() => import("./pages/profile/SecuritySet"));
const AboutApp = lazy(() => import("./pages/profile/AboutApp"));
const DailyRemind = lazy(() => import("./pages/profile/DailyRemind"));
const HelpSupp = lazy(() => import("./pages/profile/HelpSupp"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="w-10 h-10 border-4 border-teal-800 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppContent() {
  const { notifEnabled, notifTime } = useSettingsStore();
  const { loading: authLoading } = useAuth();
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  useEffect(() => {
    setupDailyNotification(notifTime, notifEnabled);
  }, []);

  const showSplash = !isAnimationDone;

  return (
    <>
      {showSplash && (
        <ShutterSplashScreen 
          ready={!authLoading} 
          onComplete={() => setIsAnimationDone(true)} 
        />
      )}
      <div style={{ display: showSplash ? "none" : "block" }}>
        <BrowserRouter>
          <ToastProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayout/>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/assistant" element={<Assistant />} />
                    <Route path="/history" element={<History />} />
                  </Route>
                  <Route element={<ProfileLayout/>}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/securityset" element={<SecuritySet />} />
                    <Route path="/profile/aboutapp" element={<AboutApp />} />
                    <Route path="/profile/dailyremind" element={<DailyRemind />} />
                    <Route path="/profile/helpsupp" element={<HelpSupp />} />
                  </Route>
                </Route>
                {/* Public Auth Routes */}
                <Route element={<AuthLayout/>}>
                  <Route path="/auth/Welcome" element={<Welcome />} />
                  <Route path="/auth/Login" element={<Login />} />
                  <Route path="/auth/Register" element={<Register />} />
                  <Route path="/auth/ForgotPass" element={<ForgotPass />} />
                  <Route path="/auth/ResetPass" element={<ResetPass />} />
                </Route>
                {/* Public Privacy */}
                <Route element={<ProfileLayout/>}>
                  <Route path="/auth/privacy" element={<Privacy />} />
                </Route>
              </Routes>
            </Suspense>
          </ToastProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
