import { NavLink } from "react-router-dom";
import { navlinks } from "../../data/navLinks";

export default function Navbar(){
    return(
        <nav className="flex justify-between py-5 px-4 text-gray-700 bg-slate-50/70 text-sm">
            {navlinks.map((link) => (
                <NavLink key={link.id} to={link.href} className={({ isActive }) =>
                `flex flex-col items-center transition-colors py-1 w-25 ${
                isActive 
                    ? 'text-teal-800 dark:text-[#00F5FF] bg-teal-800/10 rounded-lg'
                    : 'text-slate-500 dark:text-slate-400'
                }`
            }>
                <link.icon className="text-xl"/>
                <p>{link.label}</p>
            </NavLink>
            ))}
        </nav>
    );
}