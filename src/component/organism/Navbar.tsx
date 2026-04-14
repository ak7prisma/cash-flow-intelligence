import { NavLink } from "react-router-dom";
import { navlinks } from "../../data/navLinks";

export default function Navbar(){
    return(
        <nav className="flex justify-between py-5 px-4 text-gray-700 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-900/60 text-sm backdrop-blur-md fixed bottom-0 left-1 right-1 z-50">
            {navlinks.map((link) => (
                <NavLink key={link.id} to={link.href} className={({ isActive }) =>
                `flex flex-col items-center transition-colors py-1 w-25 ${
                isActive 
                    ? 'text-teal-800 dark:text-cyan-400 dark:bg-cyan-400/10 bg-teal-800/10 rounded-lg'
                    : 'rounded-lg'
                }`
            }>
                <link.icon className="text-xl"/>
                <p>{link.label}</p>
            </NavLink>
            ))}
        </nav>
    );
}