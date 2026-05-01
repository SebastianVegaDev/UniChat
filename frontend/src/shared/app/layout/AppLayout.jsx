import "./AppLayout.css";
import AppSideBar from "./sidebar/AppSidebar.jsx";
import AppTopBar from "./topbar/AppTopBar.jsx";
import { Outlet } from "react-router-dom";

function AppLayout() {
    return (
        <div className="app-layout">
            <AppSideBar />
            <div className="app-layout-content">
                <AppTopBar/>
                <main className="app-layout-main">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
