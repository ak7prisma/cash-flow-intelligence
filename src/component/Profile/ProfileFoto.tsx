import { TbPencil } from 'react-icons/tb';

export default function ProfileFoto() {
  return (
    <div className="flex flex-col items-center">
      {/* Container Foto */}
      <div className="relative">
        <img
          src="profile.jpg"
          alt="Profile"
          className="w-30 h-28 rounded-xl dark:rounded-full object-cover shadow-sm ring-slate-50 ring-3 dark:ring-cyan-400"
        />
        {/* Tombol Edit */}
        <button className="absolute -bottom-1 -right-1 bg-teal-700 dark:bg-[#00F5FF] p-2 rounded-xl border-[3px] border-white dark:border-slate-950 transition-transform active:scale-95">
          <TbPencil className="text-white dark:text-slate-900 text-sm" />
        </button>
      </div>

      {/* Nama & Email */}
      <h2 className="mt-4 text-4xl font-bold text-blue-950 dark:text-slate-100 tracking-tight">
        AK Prisma
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
        akprisma@gmail.com
      </p>
    </div>
  );
}