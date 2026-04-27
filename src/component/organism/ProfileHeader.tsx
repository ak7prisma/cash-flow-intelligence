import { BiArrowBack } from "react-icons/bi";
import { NavLink } from "react-router-dom";

export default function ProfileHeader( {text} : Readonly<{ text: string }>){

    return(
        <NavLink to="/profile" className="flex items-center justify-start px-7 pb-5 pt-10 gap-3 text-blue-950 dark:text-cyan-400 font-semibold bg-slate-50/70 dark:bg-base-dark/10 backdrop-blur-md fixed top-0 right-0 left-0 z-50 transition-colors">
            <BiArrowBack className="text-2xl" />
            <h1 className="font-semibold text-xl">{text}</h1>
        </NavLink>
    );
}