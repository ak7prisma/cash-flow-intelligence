import { NavLink, useLocation, Link } from "react-router-dom";
import { navlinks } from "../../data/navLinks";
import { TbPlus } from "react-icons/tb";

export default function Navbar() {

  const location = useLocation();

  const showAssistantButton = 
  location.pathname === '/' || location.pathname === '/history';

  return (
    <>
      {showAssistantButton && (
        <Link
          to="/assistant"
          className="fixed bottom-26 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-800 dark:bg-cyan-400 shadow-teal-500 dark:shadow-cyan-200 transition-transform duration-200 active:scale-95"
        >
          <TbPlus className="text-xl text-slate-50 dark:text-blue-950 stroke-3" />
        </Link>
      )}

      <nav className="flex justify-between py-5 px-4 text-gray-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 text-sm backdrop-blur-md fixed bottom-0 left-0 right-0 z-50">
        {navlinks.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            onClick={() => {
              sessionStorage.setItem('prevPath', location.pathname);
            }}
            className={({ isActive }) =>
              `flex flex-col items-center transition-colors py-1 w-25 ${
                isActive
                  ? 'text-teal-800 dark:text-cyan-400 dark:bg-cyan-400/10 bg-teal-800/10 rounded-lg'
                  : 'rounded-lg'
              }`
            }
          >
            <link.icon className="text-xl" />
            <p>{link.label}</p>
          </NavLink>
        ))}
      </nav>
    </>
  );
}