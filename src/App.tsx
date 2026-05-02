import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react";
import ShutterSplashScreen from "./component/ui/ShutterSplashScreen";
import { setupDailyNotification } from "./utils/notifications";
import { useSettingsStore } from "./store/useSettingsStore";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import History from "./pages/History";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import ProfileLayout from "./layout/ProfileLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPass from "./pages/auth/ResetPass";
import ForgotPass from "./pages/auth/ForgotPass";
import Privacy from "./pages/auth/Privacy";
import SecuritySet from "./pages/profile/SecuritySet";
import AboutApp from "./pages/profile/AboutApp";
import DailyRemind from "./pages/profile/DailyRemind";
import HelpSupp from "./pages/profile/HelpSupp";
import Welcome from "./pages/auth/Welcome";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./component/auth/ProtectedRoute";
import { ToastProvider } from "./component/ui/Toast";

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
