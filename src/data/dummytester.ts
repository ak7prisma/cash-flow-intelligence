import { FaUtensils } from "react-icons/fa";
import { TbWallet } from "react-icons/tb";

export const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const CHART_DATA = [2, 5.5, 2.5, 10, 4, 6.5, 1];
export const TARGET_INDEX = 3;
export const movements = [
  {
    id: 1,
    title: "The Gourmet Deli",
    time: "Today, 12:45 PM",
    amount: "- Rp 85.000",
    type: "expense",
    icon: FaUtensils,
    iconBg: "bg-slate-100 dark:bg-slate-800",
  },
  {
    id: 2,
    title: "Freelance Payout",
    time: "Yesterday",
    amount: "+ Rp 1.200.000",
    type: "income",
    icon: TbWallet,
    iconBg: "bg-teal-50 dark:bg-cyan-950/30",
  },
];