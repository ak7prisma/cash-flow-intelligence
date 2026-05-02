import { NavLink, useLocation, Link } from "react-router-dom";
import { navlinks } from "../../data/navLinks";
import { TbPlus } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const location = useLocation();

  const showAssistantButton = 
    location.pathname === '/' || location.pathname === '/history';

  return (
    <>
      <AnimatePresence>
        {showAssistantButton && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            className="fixed bottom-26 right-5 z-50"
          >
            <Link
              to="/assistant"
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-800 dark:bg-cyan-400 shadow-lg shadow-teal-900/20 dark:shadow-cyan-400/20 transition-transform duration-200 active:scale-95"
            >
              <TbPlus className="text-xl text-slate-50 dark:text-blue-950 stroke-3" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="flex justify-between items-center py-3 px-4 bg-white dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 fixed bottom-0 left-0 right-0 z-50 pb-safe">
        {navlinks.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className="relative flex-1 group"
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center py-2 relative">
                {/* Active Indicator Background */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-bg"
                    className="absolute inset-x-1 inset-y-0 bg-teal-800/10 dark:bg-cyan-400/10 rounded-2xl"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon with scaling effect */}
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -1 : 0 
                  }}
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive 
                      ? 'text-teal-800 dark:text-cyan-400' 
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                >
                  <link.icon className="text-2xl" />

                </motion.div>

                <p className={`text-[10px] mt-1 font-bold tracking-tight transition-colors duration-300 relative z-10 ${
                  isActive 
                    ? 'text-teal-800 dark:text-cyan-400' 
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}>
                  {link.label.toUpperCase()}
                </p>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}