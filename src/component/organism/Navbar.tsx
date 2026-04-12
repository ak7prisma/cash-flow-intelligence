import { GrHistory } from "react-icons/gr";
import { MdOutlineDashboard, MdOutlinePerson } from "react-icons/md";
import { VscRobot } from "react-icons/vsc";
import { NavLink } from "react-router-dom";

export default function Navbar(){
    return(
        <nav className="flex justify-between ">
            <NavLink to="/" >
                <MdOutlineDashboard />
                <p>Dashboard</p>
            </NavLink>
            <NavLink to="/assistant">
                <VscRobot />
                <p>Assistant</p>
            </NavLink>
            <NavLink to="/history">
                <GrHistory />
                <p>History</p>
            </NavLink>
            <NavLink to="/profile">
                <MdOutlinePerson />
                <p>Profile</p>
            </NavLink>
        </nav>
    );
}