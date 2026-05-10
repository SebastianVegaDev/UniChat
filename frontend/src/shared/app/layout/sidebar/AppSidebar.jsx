import "./AppSidebar.css";
import { House, Newspaper } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useBootstrapData } from "../../../../feature/bootstrap/hooks/useBootstrapData.js";
import { mapSidebarData } from "../../../../feature/sidebar/mappers/sidebar.mapper.js";

function AppSideBar() {
    const { data } = useBootstrapData();
    const sidebarData = mapSidebarData(data);
    const { courses } = sidebarData;

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

        {courses.map((course) => (
            <NavLink
                key={course.id}
                to={course.route}
                title={course.title}
                className={({ isActive }) =>
                `app-sidebar-course ${
                    isActive ? "active" : ""
                }`
                }
            >
                <span>{course.label}</span>
            </NavLink>
        ))}
        </div>
    );
}

export default AppSideBar;
