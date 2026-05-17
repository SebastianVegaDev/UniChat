import "./AppSidebar.css";
import { House, LogOut, Newspaper } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useBootstrapData } from "../../../../feature/bootstrap/hooks/useBootstrapData.js";
import { mapSidebarData } from "../../../../feature/sidebar/mappers/sidebar.mapper.js";

function AppSideBar() {
    const navigate = useNavigate();
    const { data } = useBootstrapData();
    const sidebarData = mapSidebarData(data);
    const { courses } = sidebarData;

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("unichat_bootstrap_cache");
        navigate("/login", { replace: true });
    }

    return (
        <div className="app-sidebar">
        <NavLink
            to="/"
            end
            className={({ isActive }) =>
            `app-sidebar-course app-sidebar-section ${isActive ? "active" : ""}`
            }
        >
            <span className="app-sidebar-icon"><House /></span>
            <span className="app-sidebar-tooltip">Home</span>
        </NavLink>

        <NavLink
            to="/news"
            className={({ isActive }) =>
            `app-sidebar-course app-sidebar-section ${
                isActive ? "active" : ""
            }`
            }
        >
            <span className="app-sidebar-icon"><Newspaper /></span>
            <span className="app-sidebar-tooltip">News</span>
        </NavLink>

        {courses.map((course) => (
            <NavLink
                key={course.id}
                to={course.route}
                title={course.title}
                className={({ isActive }) =>
                `app-sidebar-course ${isActive ? "active" : ""
                }`
                }
            >
                <span className="app-sidebar-icon">{course.label}</span>
                {course.pending > 0 && (
                    <span className="app-sidebar-badge">{course.pending}</span>
                )}
                <span className="app-sidebar-tooltip">{course.title}</span>
            </NavLink>
        ))}
        <button
            type="button"
            className="app-sidebar-course app-sidebar-logout"
            title="Cerrar sesión"
            onClick={handleLogout}
        >
            <span className="app-sidebar-icon"><LogOut /></span>
            <span className="app-sidebar-tooltip">Cerrar sesión</span>
        </button>
        </div>
    );
}

export default AppSideBar;
