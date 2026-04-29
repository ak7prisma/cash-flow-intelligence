import { FaUtensils, FaShoppingBag, FaPlane, FaHome, FaBriefcase } from "react-icons/fa";

export const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const CHART_DATA = [2, 5.5, 2.5, 10, 4, 6.5, 1];
export const TARGET_INDEX = 3;
export const movements = [
  {
    id: 1,
    title: "Apple Store Soho",
    subtitle: "Electronics & Hardware",
    time: "Today, 10:45 AM",
    amount: "- Rp 1.299.000",
    type: "expense",
    icon: FaShoppingBag,
    iconBg: "bg-slate-100 dark:bg-slate-800",
  },
  {
    id: 2,
    title: "Delta Airlines",
    subtitle: "Travel",
    time: "Yesterday",
    amount: "- Rp 840.500",
    type: "expense",
    icon: FaPlane,
    iconBg: "bg-slate-100 dark:bg-slate-800",
  },
  {
    id: 3,
    title: "Nobu Downtown",
    subtitle: "Dining",
    time: "Oct 24, 2023",
    amount: "- Rp 312.000",
    type: "expense",
    icon: FaUtensils,
    iconBg: "bg-slate-100 dark:bg-slate-800",
  },
  {
    id: 4,
    title: "Monthly Rent Payment",
    subtitle: "Housing",
    time: "Oct 01, 2023",
    amount: "- Rp 4.500.000",
    type: "expense",
    icon: FaHome,
    iconBg: "bg-slate-100 dark:bg-slate-800",
  },
  {
    id: 5,
    title: "Salary Deposit",
    subtitle: "Income",
    time: "Oct 31, 2023",
    amount: "+ Rp 15.200.000",
    type: "income",
    icon: FaBriefcase,
    iconBg: "bg-teal-50 dark:bg-cyan-950/30",
  },
];