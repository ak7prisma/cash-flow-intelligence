import { Outlet } from "react-router-dom";
import MainHeader from "../component/organism/MainHeader";
import Navbar from "../component/organism/Navbar";

export default function MainLayout() {
  return (
    <div className="relative min-h-screen w-screen flex flex-col justify-between overflow-x-hidden bg-slate-50 dark:bg-base-dark transition-colors duration-300">
      
      <div className="fixed -top-20 -left-20 size-80 rounded-full blur-[100px] opacity-20 pointer-events-none z-0 
        bg-teal-800 dark:bg-cyan-400" />
      
      <div className="fixed top-1/2 -right-20 size-96 rounded-full blur-[120px] opacity-15 pointer-events-none z-0 
        bg-teal-800 dark:bg-cyan-400" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <MainHeader />
        
        <main className="mx-5 my-5 flex-1 no-scrollbar">
          <Outlet />
        </main>
        
        <Navbar />
      </div>
    </div>
  );
}