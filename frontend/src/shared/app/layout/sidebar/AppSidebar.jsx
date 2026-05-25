import "./AppSidebar.css";
import { House, LogOut, Newspaper, ShieldCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useBootstrap } from "../../../../feature/bootstrap/hooks/useBootstrap.js";
import { mapSidebarData } from "../../../../feature/sidebar/mappers/sidebar.mapper.js";
import { toast } from "react-toastify"
import { disconnectSocket } from "../../../../feature/realtime/socket.js";
import { usePreferenceTexts } from "../../../../feature/preferences/context/PreferencesContext.js";

function AppSideBar() {
    const navigate = useNavigate();
    const { data } = useBootstrap();
    const texts = usePreferenceTexts();
    const { sidebar } = texts;
    const sidebarData = mapSidebarData(data, texts);
    const { courses } = sidebarData;
    const users = data?.users ?? [];
    const currentUserId = data?.session?.currentUserId;
    const currentUser = users.find((user) => `${user.id}` === `${currentUserId}`);
    const isAdmin = currentUser?.role === "admin";

    function clearAiChatCache() {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("unichat_ai_chat_cache_")) {
                localStorage.removeItem(key);
            }
        });
    }

    function handleLogout() {
        disconnectSocket();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("unichat_bootstrap_cache");
        clearAiChatCache();
        navigate("/login", { replace: true });
        toast.success(sidebar.logoutSuccess)
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
            <span className="app-sidebar-tooltip">{sidebar.home}</span>
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
            <span className="app-sidebar-tooltip">{sidebar.news}</span>
        </NavLink>

        {isAdmin && (
            <NavLink
                to="/admin"
                className={({ isActive }) =>
                `app-sidebar-course app-sidebar-section ${
                    isActive ? "active" : ""
                }`
                }
            >
                <span className="app-sidebar-icon"><ShieldCheck /></span>
                <span className="app-sidebar-tooltip">{sidebar.admin}</span>
            </NavLink>
        )}

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
            title={sidebar.logout}
            onClick={handleLogout}
        >
            <span className="app-sidebar-icon"><LogOut /></span>
            <span className="app-sidebar-tooltip">{sidebar.logout}</span>
        </button>
        </div>
    );
}

export default AppSideBar;
