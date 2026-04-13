import { TbSunHighFilled } from "react-icons/tb";

export default function MainHeader(){
    return(
        <header className="flex items-center justify-between p-5 pt-10 bg-slate-50/70">
            <div className="flex items-center">
                <img src="LogoCFI.png" alt="Logo CFI" className="size-10"/>
                <h1 className="font-semibold text-xl">Cash Flow Intelligence</h1>
            </div>
            <TbSunHighFilled className="text-2xl" />
        </header>
    );
}