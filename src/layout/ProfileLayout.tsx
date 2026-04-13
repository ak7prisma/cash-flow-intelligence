import { Outlet } from "react-router-dom";
import Navbar from "../component/organism/Navbar";
import ProfileHeader from "../component/organism/ProfileHeader";

export default function ProfileLayout(){
    return(
        <div className="h-screen w-screen flex flex-col justify-between">
            <ProfileHeader />
            <main className="mx-24">
                <Outlet />
            </main>
            <Navbar />
        </div>
    );
}