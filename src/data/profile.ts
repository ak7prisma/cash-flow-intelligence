import { PiShieldCheckeredFill } from "react-icons/pi";
import { TbBellRinging, TbSun, TbInfoCircle, TbHelp } from "react-icons/tb";

export const settingData = [
    {
      id: 1,
      toggle: false,
      to: "/profile/securityset",
      icon: PiShieldCheckeredFill ,
      title: "Security Settings",
      subtitle: "Manage your password.",
    },
    {
      id: 2,
      toggle: false,
      to: "/profile/dailyremind",
      icon: TbBellRinging ,
      title: "Daily Reminder",
      subtitle: "Set your daily reminder.",
    },
    {
      id: 3,
      toggle: true,
      to: "",
      icon: TbSun ,
      title: "Appearance",
      subtitle: "Turn on dark mode",
    },
  ];

export  const supportData = [
    {
      id: 1,
      toggle: false,
      to: "/profile/aboutapp",
      icon: TbInfoCircle ,
      title: "About App",
      subtitle: "App info and version.",
    },
    {
      id: 2,
      toggle: false,
      to: "/profile/helpsupp",
      icon: TbHelp ,
      title: "Help & Support",
      subtitle: "FAQ and contact us.",
    },
  ];