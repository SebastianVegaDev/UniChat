import "./AppSidebar.css";
import { House, Newspaper } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function AppSideBar() {
    const [course, setCourse] = useState("");

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

        <button
            className={`app-sidebar-course ${course === "ws" ? "active" : ""}`}
            onClick={() => setCourse("ws")}
        >
            <span>WS</span>
        </button>

        <button
            className={`app-sidebar-course ${course === "qd" ? "active" : ""}`}
            onClick={() => setCourse("qd")}
        >
            <span>QD</span>
        </button>

        <button
            className={`app-sidebar-course ${course === "rs" ? "active" : ""}`}
            onClick={() => setCourse("rs")}
        >
            <span>RS</span>
        </button>

        <button
            className={`app-sidebar-course ${course === "he" ? "active" : ""}`}
            onClick={() => setCourse("he")}
        >
            <span>HE</span>
        </button>
        </div>
    );
}

export default AppSideBar;