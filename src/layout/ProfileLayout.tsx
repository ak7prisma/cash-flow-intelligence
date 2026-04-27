import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../component/organism/Navbar";
import ProfileHeader from "../component/organism/ProfileHeader";

import BackgroundElement from "../component/ui/BackgroundElement";
import { getProfileHeaderText } from "../utils/getProfileHeaderText";

export default function ProfileLayout(){

   const location = useLocation();

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments.at(-1);

    const headerText = getProfileHeaderText(lastSegment);

    return(
        <div className="relative min-h-screen w-screen flex flex-col justify-between overflow-x-hidden bg-slate-50 dark:bg-base-dark transition-colors duration-300">
            <BackgroundElement />

            <ProfileHeader text={headerText} />
            <main className="mx-5 py-30 min-h-screen flex flex-col justify-center items-center">
                <Outlet />
            </main>
            <Navbar />
        </div>
    );
}