import { Outlet, useLocation } from "react-router-dom";
import MainHeader from "../component/organism/MainHeader";
import Navbar from "../component/organism/Navbar";
import BackgroundElement from "../component/ui/BackgroundElement";

export default function MainLayout() {

  const location = useLocation();

  const showAssistantButton = location.pathname === '/' || location.pathname === '/history';
    
  return (
    <div className="relative min-h-screen w-screen flex flex-col justify-between overflow-x-hidden bg-slate-50 dark:bg-base-dark transition-colors duration-300">
    
      <BackgroundElement /> 
      
      <div className={`relative z-10 flex flex-col min-h-screen mt-23 ${showAssistantButton? 'mb-40' : 'mb-20' }`}>
        <MainHeader />
        
        <main className="mx-5 my-5 flex-1 no-scrollbar">
          <Outlet />
        </main>
        
        <Navbar />
      </div>
    </div>
  );
}