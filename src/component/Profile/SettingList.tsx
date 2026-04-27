import { NavLink } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import { TbChevronDown } from "react-icons/tb";

interface SettingItem {
  id: string | number;
  toggle: boolean;
  to: string;
  icon: string;
  title: string;
  subtitle: string;
}

interface SettingListProps {
  sectionTitle: string;
  items: SettingItem[];
}

export default function SettingList({ sectionTitle, items }: Readonly<SettingListProps>) {

  return (
    <div className="">
      {/* Judul Section */}
      <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase mb-3 px-1">
        {sectionTitle}
      </h3>
      
      {/* Kotak List */}
      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col gap-6">
        {items.map((item) => (
          <NavLink to={item.to} key={item.id} className="flex items-center justify-between cursor-pointer group">
            {/* Icon + Teks */}
            <div className="flex items-center gap-4">
              <div className="bg-teal-50 dark:bg-cyan-950/30 p-3 rounded-2xl text-teal-800 dark:text-cyan-400 text-xl transition-colors group-hover:bg-teal-100 dark:group-hover:bg-cyan-950/50">
                <item.icon />
              </div>
              <div className="flex flex-col">
                <span className="text-blue-950 dark:text-slate-100 font-bold text-sm">
                  {item.title}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>
            
            {/* Panah atau Toggle */}
            <div className="text-slate-400 dark:text-slate-500">
              {item.toggle? <ThemeToggle /> : <TbChevronDown className="xl" />}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}