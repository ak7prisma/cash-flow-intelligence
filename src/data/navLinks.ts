import { GrHistory } from "react-icons/gr";
import { MdOutlineDashboard, MdOutlinePerson } from "react-icons/md";
import { VscRobot } from "react-icons/vsc";

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
        icon:VscRobot,
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