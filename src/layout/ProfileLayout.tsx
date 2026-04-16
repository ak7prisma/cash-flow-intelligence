import { Outlet } from "react-router-dom";
import Navbar from "../component/organism/Navbar";
import ProfileHeader from "../component/organism/ProfileHeader";
import BackgroundElement from "../component/ui/BackgroundElement";

export default function ProfileLayout(){
    return(
        <div className="relative min-h-screen w-screen flex flex-col justify-between overflow-x-hidden bg-slate-50 dark:bg-base-dark transition-colors duration-300">
            <BackgroundElement />

            <ProfileHeader />
            <main className="mt-26 mx-5 mb-14">
                <Outlet />
            </main>
            <Navbar />
        </div>
    );
}