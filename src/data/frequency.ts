import { IoCalendarOutline, IoBriefcaseOutline } from "react-icons/io5";

export  const frequencyOptions = [
    { 
      value: 'daily', 
      label: 'Daily', 
      description: 'Seven days a week',
      icon: IoCalendarOutline
    },
    { 
      value: 'weekdays', 
      label: 'Weekdays', 
      description: 'Monday through Friday',
      icon: IoBriefcaseOutline
    },
  ];