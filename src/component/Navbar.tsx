import { NavLink } from "react-router-dom";

export default function Navbar(){
    return(
        <nav>
            <NavLink to="/">
                Dashboard
            </NavLink>
            <NavLink to="/assistant">
                Assistant
            </NavLink>
            <NavLink to="/history">
                History
            </NavLink>
            <NavLink to="/profile">
                Profile
            </NavLink>
        </nav>
    );
}