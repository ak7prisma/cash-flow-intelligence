import { Outlet } from "react-router-dom";
import MainHeader from "../component/organism/MainHeader";
import Navbar from "../component/organism/Navbar";

export default function MainLayout(){
    return(
        <div className="h-screen w-screen flex flex-col justify-between overflow-auto no-scrollbar">
            <MainHeader />
            <main className="mx-5 my-5">
                <Outlet />
            </main>
            <Navbar />
        </div>
    );
}