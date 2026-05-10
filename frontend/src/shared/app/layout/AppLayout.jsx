import "./AppLayout.css";
import AppSideBar from "./sidebar/AppSidebar.jsx";
import AppTopBar from "./topbar/AppTopBar.jsx";
import { Outlet, useLocation } from "react-router-dom";

function AppLayout() {
    const location = useLocation();

    return (
        <div className="app-layout">
            <AppSideBar />
            <div className="app-layout-content">
                <AppTopBar/>
                <main className="app-layout-main">
                    <div className="app-layout-page" key={location.pathname}>
                        <Outlet/>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
