import { techStackData, developerData } from "../../../data/aboutapp";
import { IconUI } from "../../ui/IconUI";
import SettingCard from "../../ui/SettingCard";
import { RiSparkling2Line } from "react-icons/ri";

export default function AboutContent() {
  return (
    <div className="flex-1 space-y-5 overflow-y-auto">

      <SettingCard title="The Vision">
        <div className="relative leading-relaxed text-blue-950 dark:text-white">
          <RiSparkling2Line size={22} className="absolute w-15 h-15 top-0 right-0 text-slate-500/30" />
          <p className="text-base">
            Cash Flow Intelligence reimagined. We transform complex financial habits into clear, AI-driven insights—helping you master your personal wealth with the power of Gemini.
          </p>
        </div>
      </SettingCard>

      <SettingCard title="Developer">
        {developerData.map((dev) => (
          <div key={dev.id} className="flex items-center mb-3 last:mb-0">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-cyan-950/30 flex items-center justify-center text-teal-800 dark:text-cyan-400 mr-4">
              <dev.icon size={24} />
            </div>
            <div>
              <p className="text-base font-bold text-blue-950 dark:text-white">{dev.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{dev.role}</p>
            </div>
          </div>
        ))}
      </SettingCard>

      <SettingCard title="Tech Stack">
        <div className="flex items-center justify-between px-1">
          {techStackData.map((item) => (
            <IconUI key={item.name} Icon={item.icon}/>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}
