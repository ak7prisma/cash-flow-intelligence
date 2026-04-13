import { Outlet } from "react-router-dom";
import MainHeader from "../component/organism/MainHeader";
import Navbar from "../component/organism/Navbar";

export default function MainLayout(){
    return(
        <div className="h-screen w-screen flex flex-col justify-between">
            <MainHeader />
            <main className="w-full flex-1 overflow-y-auto no-scrollbar">
                <Outlet />
            </main>
            <Navbar />
        </div>
    );
}