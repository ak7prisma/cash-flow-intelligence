import { TbLogout } from "react-icons/tb";

export default function ProfileFooter() {
  return (
    <div className="flex flex-col items-center">
      {/* Tombol Logout */}
      <button className="w-full bg-red-600 dark:bg-red-600/15 dark:rounded-full ring-2 dark:ring-red-600/50 text-slate-50 dark:text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 active:bg-red-700 dark:active:bg-red-600/20">
        <TbLogout className="text-xl" />
        <span>Log Out</span>
      </button>

      {/* Tulisan Versi */}
      <span className="mt-6 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
        VERSION 1.0.0
      </span>
    </div>
  );
}