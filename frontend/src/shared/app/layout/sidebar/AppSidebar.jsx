import "./AppSidebar.css";
import { House, Newspaper } from "lucide-react";
import { NavLink } from "react-router-dom";

function AppSideBar() {
    return (
        <div className="app-sidebar">
        <NavLink
            to="/"
            end
            className={({ isActive }) =>
            `app-sidebar-course app-sidebar-section ${
                isActive ? "active" : ""
            }`
            }
        >
            <span>
            <House />
            </span>
        </NavLink>

        <NavLink
            to="/news"
            className={({ isActive }) =>
            `app-sidebar-course app-sidebar-section ${
                isActive ? "active" : ""
            }`
            }
        >
            <span>
            <Newspaper />
            </span>
        </NavLink>

        <NavLink
            to="/course/mate"
            className={({ isActive }) =>
            `app-sidebar-course ${
                isActive ? "active" : ""
            }`
            }
        >
            <span>MA</span>
        </NavLink>
        </div>
    );
}

export default AppSideBar;
