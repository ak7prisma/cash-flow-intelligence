import { Outlet } from "react-router-dom";
import BackgroundElement from "../component/ui/BackgroundElement";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-6 transition-colors duration-500">
      
      {/* Background Overlays */}
      <BackgroundElement />
      
      <div className="absolute inset-0 pointer-events-none z-0">
        <img 
          src="/asset/LightOverlay.png" 
          alt="" 
          className="h-full object-cover dark:hidden"
        />
        <img 
          src="/asset/DarkOverlay.png" 
          alt="" 
          className="h-full object-cover hidden dark:block"
        />
      </div>

      {/* Main Content */}
      <main className="w-full mx-5 my-8 max-w-sm relative z-10">
        <Outlet />
      </main>
    </div>
  );
}