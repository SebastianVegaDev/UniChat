import "./AdminContent.css";
import { useState } from "react";
import AdminTabs from "./AdminTabs.jsx";
import AdminSummaryGrid from "./AdminSummaryGrid.jsx";
import AdminSecurityPanel from "./panels/AdminSecurityPanel.jsx";
import AdminCoursesPanel from "./panels/AdminCoursesPanel.jsx";
import AdminNewsPanel from "./panels/AdminNewsPanel.jsx";
import AdminUsersPanel from "./panels/AdminUsersPanel.jsx";

function AdminContent({ adminData, handleAddCourseUser, handleApproveDelegate, handleCreateCourse, handleDeleteAnnouncement, handleDeleteCourse, handleRejectDelegate, handleSaveAnnouncement, handleToggleUserBlock, handleUpdateAnnouncementStatus, handleUpdateCourse }) {
    const [activeSection, setActiveSection] = useState("security");

    return (
        <div className="admin-content">
            <AdminSummaryGrid summary={adminData.summary} />
            <AdminTabs activeSection={activeSection} setActiveSection={setActiveSection} />

            {activeSection === "security" && (
                <AdminSecurityPanel
                    adminData={adminData}
                    handleApproveDelegate={handleApproveDelegate}
                    handleRejectDelegate={handleRejectDelegate}
                />
            )}

            {activeSection === "courses" && (
                <AdminCoursesPanel
                    adminData={adminData}
                    handleAddCourseUser={handleAddCourseUser}
                    handleCreateCourse={handleCreateCourse}
                    handleDeleteCourse={handleDeleteCourse}
                    handleUpdateCourse={handleUpdateCourse}
                />
            )}

            {activeSection === "news" && (
                <AdminNewsPanel
                    adminData={adminData}
                    handleDeleteAnnouncement={handleDeleteAnnouncement}
                    handleSaveAnnouncement={handleSaveAnnouncement}
                    handleUpdateAnnouncementStatus={handleUpdateAnnouncementStatus}
                />
            )}

            {activeSection === "users" && (
                <AdminUsersPanel
                    adminData={adminData}
                    handleToggleUserBlock={handleToggleUserBlock}
                />
            )}
        </div>
    );
}

export default AdminContent;