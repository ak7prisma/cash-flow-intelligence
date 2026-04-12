import { Outlet } from "react-router-dom";
import MainHeader from "../component/organism/MainHeader";
import Navbar from "../component/organism/Navbar";

export default function MainLayout(){
    return(
        <div>
            <MainHeader />
            <main>
                <Outlet />
            </main>
            <Navbar />
        </div>
    );
}