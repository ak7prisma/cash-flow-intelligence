import { Outlet } from "react-router-dom";
import MainHeader from "../component/organism/MainHeader";
import Navbar from "../component/organism/Navbar";

export default function MainLayout(){
    return(
        <div className="h-screen w-screen flex flex-col justify-between">
            <MainHeader />
            <main className="mx-24">
                <Outlet />
            </main>
            <Navbar />
        </div>
    );
}