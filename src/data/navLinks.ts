import { GrHistory } from "react-icons/gr";
import { MdOutlineDashboard, MdOutlinePerson } from "react-icons/md";
import { RiRobot2Line } from "react-icons/ri";

export const navlinks = [
    {
        id:1,
        href:"/",
        label:"Dashboard",
        icon:MdOutlineDashboard
    },
    {
        id:2,
        href:"/assistant",
        label:"Assistant",
        icon:RiRobot2Line,
    },
    {
        id:1,
        href:"/history",
        label:"History",
        icon:GrHistory,
    },
    {
        id:1,
        href:"/profile",
        label:"Profile",
        icon:MdOutlinePerson,
    },
]