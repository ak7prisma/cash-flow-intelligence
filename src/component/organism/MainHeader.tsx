import { useState, useEffect } from "react";
import { RxMoon } from "react-icons/rx";
import { TbSunHighFilled } from "react-icons/tb";

export default function MainHeader() {
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.classList.contains("dark");
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    return (
        <header className="flex items-center justify-between p-5 pt-10 text-blue-950 dark:text-slate-100 bg-slate-50/60 dark:bg-base-dark/60 backdrop-blur-md fixed top-0 right-1 left-1 z-50 transition-colors">
            
            <div className="flex items-center gap-2">
                <img src="LogoCFI.png" alt="Logo CFI" className="size-10" />
                <h1 className="font-semibold text-xl dark:text-cyan-400">Cash Flow Intelligence</h1>
            </div>
            
            <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors active:scale-95 text-2xl dark:text-cyan-400"
            >
                {isDark ? <RxMoon /> : <TbSunHighFilled />}
            </button>
            
        </header>
    );
}