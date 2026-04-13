import { BiArrowBack } from "react-icons/bi";

export default function ProfileHeader(){
    return(
        <header className="flex items-center justify-start px-7 pb-5 pt-10 gap-3 text-blue-950 font-semibold bg-slate-50/70">
            <BiArrowBack className="text-2xl" />
            <h1 className="font-semibold text-xl">Profile</h1>
        </header>
    );
}