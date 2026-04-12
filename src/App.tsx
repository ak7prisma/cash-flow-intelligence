import { BrowserRouter, Route, Routes } from "react-router-dom"
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
import SecuritySet from "./pages/profile/SecuritySet";
import AboutApp from "./pages/profile/AboutApp";
import DailyRemind from "./pages/profile/DailyRemind";
import HelpSupp from "./pages/profile/HelpSupp";
import Privacy from "./pages/profile/Privacy";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route element={<MainLayout/>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/history" element={<History />} />
        </Route>

        <Route element={<AuthLayout/>}>
          <Route path="/auth/Login" element={<Login />} />
          <Route path="/auth/Register" element={<Register />} />
          <Route path="/auth/ForgotPass" element={<ForgotPass />} />
          <Route path="/auth/ResetPass" element={<ResetPass />} />
        </Route>
        
        <Route element={<ProfileLayout/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/securityset" element={<SecuritySet />} />
          <Route path="/aboutapp" element={<AboutApp />} />
          <Route path="/dailyremind" element={<DailyRemind />} />
          <Route path="/helpsupp" element={<HelpSupp />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>
      </Routes>

      
    </BrowserRouter>
  )
}

export default App
