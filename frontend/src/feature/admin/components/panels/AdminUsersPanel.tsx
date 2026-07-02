import "./AdminUsersPanel.css";
import { Lock, Unlock } from "lucide-react";
import { useMemo, useState } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import AppButton from "../../../../shared/ui/primitives/button/AppButton.jsx";
import EmptyText from "../../../../shared/ui/primitives/empty/EmptyText.jsx";
import StatusPill from "../../../../shared/ui/primitives/status/StatusPill.jsx";
import { filterAdminUsers, findSelectedUser, getUserCourses } from "../../helpers/adminSelectors.js";

function AdminUsersPanel({ adminData, handleToggleUserBlock }) {
    const { admin } = usePreferenceTexts();
    const [searchValue, setSearchValue] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(adminData.users[0]?.id ?? null);
    const filteredUsers = filterAdminUsers(adminData.users, searchValue);
    const selectedUser = useMemo(() => {
        return findSelectedUser(adminData.users, selectedUserId);
    }, [adminData.users, selectedUserId]);
    const selectedUserCourses = getUserCourses(adminData.courses, selectedUser);
    const isCurrentUser = selectedUser?.id === adminData.currentUser?.id;

    return (
        <div className="admin-users-panel">
            <section className="admin-card admin-users-list-card">
                <div className="admin-card-header">
                    <h3>{admin.sections.users}</h3>
                </div>

                <div className="admin-users-search">
                    <input
                        value={searchValue}
                        placeholder={admin.labels.searchUser}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                </div>

                <div className="admin-users-list">
                    {filteredUsers.length === 0 && (
                        <EmptyText>{admin.empty.noUsers}</EmptyText>
                    )}

                    {filteredUsers.map((user) => (
                        <button
                            key={user.id}
                            type="button"
                            className={`admin-user-option ${selectedUser?.id === user.id ? "active" : ""}`}
                            onClick={() => setSelectedUserId(user.id)}
                        >
                            <span>{user.name[0]}</span>
                            <div>
                                <strong>{user.name}</strong>
                                <small>{user.code} - {user.roleLabel} - {user.coursesCount} {admin.labels.courses}</small>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="admin-card admin-user-detail-card">
                {selectedUser && (
                    <>
                        <div className="admin-card-header">
                            <div>
                                <h3>{selectedUser.name}</h3>
                                <span>{selectedUser.email}</span>
                            </div>

                            <div className="admin-row-actions">
                                {isCurrentUser && (
                                    <StatusPill type="active">
                                        {admin.labels.currentSession}
                                    </StatusPill>
                                )}

                                {!isCurrentUser && selectedUser.status === "blocked" && (
                                    <AppButton
                                        icon={Unlock}
                                        variant="secondary"
                                        onClick={() => handleToggleUserBlock(selectedUser.id, false)}
                                    >
                                        {admin.actions.unblockUser}
                                    </AppButton>
                                )}

                                {!isCurrentUser && selectedUser.status !== "blocked" && (
                                    <AppButton
                                        icon={Lock}
                                        variant="danger"
                                        onClick={() => handleToggleUserBlock(selectedUser.id, true)}
                                    >
                                        {admin.actions.blockUser}
                                    </AppButton>
                                )}
                            </div>
                        </div>

                        <div className="admin-user-details">
                            <div>
                                <span>{admin.labels.userCode}</span>
                                <strong>{selectedUser.code}</strong>
                            </div>
                            <div>
                                <span>{admin.labels.role}</span>
                                <strong>{selectedUser.roleLabel}</strong>
                            </div>
                            <div>
                                <span>{admin.labels.status}</span>
                                <StatusPill type={selectedUser.status}>
                                    {selectedUser.statusLabel}
                                </StatusPill>
                            </div>
                            <div>
                                <span>{admin.labels.joinedAt}</span>
                                <strong>{selectedUser.createdAt}</strong>
                            </div>
                            <div>
                                <span>{admin.labels.lastActivity}</span>
                                <strong>{selectedUser.lastActivity}</strong>
                            </div>
                        </div>

                        <div className="admin-user-courses">
                            <h4>{admin.labels.userActivity}</h4>

                            <div className="admin-list">
                                {selectedUserCourses.map((course) => (
                                    <article className="admin-list-row" key={`${selectedUser.id}-${course.id}`}>
                                        <div className="admin-list-row-main">
                                            <strong>{course.title}</strong>
                                            <span>{course.professor}</span>
                                        </div>

                                        <StatusPill type="default">
                                            {course.shortName}
                                        </StatusPill>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

export default AdminUsersPanel;