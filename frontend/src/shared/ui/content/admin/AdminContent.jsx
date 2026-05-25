import "./AdminContent.css";
import {
    BookOpen,
    Check,
    Lock,
    Newspaper,
    Pencil,
    Plus,
    Save,
    ShieldCheck,
    Trash2,
    Unlock,
    UserPlus,
    Users,
    X
} from "lucide-react";
import { useMemo, useState } from "react";
import { usePreferenceTexts } from "../../../../feature/preferences/context/PreferencesContext.js";

const SECTION_ICONS = {
    security: ShieldCheck,
    courses: BookOpen,
    news: Newspaper,
    users: Users
};

function AdminButton({ children, icon: Icon, variant = "primary", ...props }) {
    return (
        <button className={`admin-content-button ${variant}`} type="button" {...props}>
            {Icon && <Icon />}
            {children}
        </button>
    );
}

function AdminEmpty({ children }) {
    return <p className="admin-content-empty">{children}</p>;
}

function AdminMetric({ label, value }) {
    return (
        <div className="admin-content-metric">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function AdminStatus({ children, type = "active" }) {
    return <span className={`admin-content-status ${type}`}>{children}</span>;
}

function ConfirmModal({ title, description, cancelLabel, confirmLabel, onCancel, onConfirm }) {
    return (
        <div className="admin-content-modal">
            <button className="admin-content-modal-backdrop" type="button" onClick={onCancel} />
            <div className="admin-content-modal-panel">
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="admin-content-row-actions right">
                    <AdminButton variant="ghost" onClick={onCancel}>{cancelLabel}</AdminButton>
                    <AdminButton icon={Trash2} variant="danger" onClick={onConfirm}>{confirmLabel}</AdminButton>
                </div>
            </div>
        </div>
    );
}

function AdminSectionNav({ activeSection, setActiveSection }) {
    const { admin } = usePreferenceTexts();

    return (
        <div className="admin-content-nav">
            {Object.entries(admin.sections).map(([sectionId, label]) => {
                const Icon = SECTION_ICONS[sectionId];

                return (
                    <button
                        key={sectionId}
                        className={activeSection === sectionId ? "active" : ""}
                        type="button"
                        onClick={() => setActiveSection(sectionId)}
                    >
                        <Icon />
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

function SecurityPanel({ adminData, handleApproveDelegate, handleRejectDelegate }) {
    const { admin } = usePreferenceTexts();
    const pendingDelegates = adminData.courses.flatMap((course) => {
        return course.pendingDelegates.map((delegate) => ({
            ...delegate,
            courseTitle: course.title
        }));
    });

    return (
        <div className="admin-content-grid security">
            <div className="admin-content-metrics">
                <AdminMetric label={admin.labels.totalUsers} value={adminData.summary.totalUsers} />
                <AdminMetric label={admin.labels.admins} value={adminData.summary.admins} />
                <AdminMetric label={admin.labels.teachers} value={adminData.summary.teachers} />
                <AdminMetric label={admin.labels.students} value={adminData.summary.students} />
                <AdminMetric label={admin.labels.pendingDelegates} value={adminData.summary.pendingDelegates} />
            </div>

            <div className="admin-content-panel">
                <div className="admin-content-panel-header">
                    <h3>{admin.labels.systemRules}</h3>
                </div>
                <div className="admin-content-rules">
                    {adminData.rules.map((rule) => (
                        <div className="admin-content-rule" key={rule}>
                            <ShieldCheck />
                            <p>{rule}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="admin-content-panel">
                <div className="admin-content-panel-header">
                    <h3>{admin.labels.pendingDelegates}</h3>
                </div>
                <div className="admin-content-list compact">
                    {pendingDelegates.length === 0 && <AdminEmpty>{admin.empty.noPendingDelegates}</AdminEmpty>}
                    {pendingDelegates.map((delegate) => (
                        <div className="admin-content-user-row" key={`${delegate.courseTitle}-${delegate.id}`}>
                            <div>
                                <strong>{delegate.name}</strong>
                                <span>{delegate.courseTitle}</span>
                            </div>
                            <div className="admin-content-row-actions">
                                <AdminButton
                                    icon={Check}
                                    variant="ghost"
                                    onClick={() => handleApproveDelegate(delegate.courseId, delegate.id)}
                                >
                                    {admin.actions.approve}
                                </AdminButton>
                                <AdminButton
                                    icon={X}
                                    variant="ghost"
                                    onClick={() => handleRejectDelegate(delegate.courseId, delegate.id)}
                                >
                                    {admin.actions.reject}
                                </AdminButton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function getFormValues(event) {
    const formData = new FormData(event.currentTarget);

    return Object.fromEntries(formData.entries());
}

function CoursesPanel({ adminData, handleAddCourseUser, handleCreateCourse, handleDeleteCourse, handleUpdateCourse }) {
    const { admin } = usePreferenceTexts();
    const [selectedCourseId, setSelectedCourseId] = useState(adminData.courses[0]?.id ?? null);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const selectedCourse = useMemo(() => {
        return adminData.courses.find((course) => course.id === selectedCourseId) ?? adminData.courses[0] ?? null;
    }, [adminData.courses, selectedCourseId]);
    const teacherOptions = adminData.teachers;
    const classroomOptions = adminData.classrooms;

    async function submitCreateCourse(event) {
        event.preventDefault();
        await handleCreateCourse(getFormValues(event));
    }

    async function submitUpdateCourse(event) {
        event.preventDefault();
        await handleUpdateCourse(selectedCourse.id, getFormValues(event));
    }

    async function submitAddCourseUser(event) {
        event.preventDefault();

        const { code } = getFormValues(event);

        await handleAddCourseUser(selectedCourse.id, code);
        event.currentTarget.reset();
    }

    async function confirmDeleteCourse() {
        if (!courseToDelete) return;

        await handleDeleteCourse(courseToDelete.id);
        setSelectedCourseId(adminData.courses.find((course) => course.id !== courseToDelete.id)?.id ?? "new");
        setCourseToDelete(null);
    }

    return (
        <div className="admin-content-grid two-columns">
            <div className="admin-content-panel">
                <div className="admin-content-panel-header">
                    <h3>{admin.labels.courseList}</h3>
                    <AdminButton icon={Plus} onClick={() => setSelectedCourseId("new")}>{admin.actions.createCourse}</AdminButton>
                </div>
                <div className="admin-content-list">
                    <button
                        type="button"
                        className={`admin-content-course new ${selectedCourseId === "new" ? "active" : ""}`}
                        onClick={() => setSelectedCourseId("new")}
                    >
                        <span>+</span>
                        <div>
                            <strong>{admin.labels.createCourse}</strong>
                            <small>{admin.actions.createCourse}</small>
                        </div>
                    </button>
                    {adminData.courses.length === 0 && <AdminEmpty>{admin.empty.noCourses}</AdminEmpty>}
                    {adminData.courses.map((course) => (
                        <button
                            key={course.id}
                            type="button"
                            className={`admin-content-course ${selectedCourse?.id === course.id ? "active" : ""}`}
                            onClick={() => setSelectedCourseId(course.id)}
                        >
                            <span>{course.shortName}</span>
                            <div>
                                <strong>{course.title}</strong>
                                <small>{course.membersCount} {admin.labels.members} - {course.delegatesCount} {admin.roleLabels.delegate}</small>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="admin-content-panel wide">
                {selectedCourseId === "new" && (
                    <>
                        <div className="admin-content-panel-header">
                            <div>
                                <h3>{admin.labels.createCourse}</h3>
                                <span>{admin.labels.courseDetails}</span>
                            </div>
                        </div>
                        <form className="admin-content-form" onSubmit={submitCreateCourse}>
                            <div className="admin-content-form-row">
                                <label>
                                    <span>{admin.labels.shortName}</span>
                                    <input name="shortName" placeholder="OS" />
                                </label>
                                <label>
                                    <span>{admin.labels.title}</span>
                                    <input name="title" placeholder={admin.labels.createCourse} />
                                </label>
                            </div>
                            <div className="admin-content-form-row">
                                <label>
                                    <span>{admin.labels.slug}</span>
                                    <input name="slug" placeholder="operating-systems" />
                                </label>
                                <label>
                                    <span>{admin.labels.currentWeek}</span>
                                    <input name="currentWeek" min="1" type="number" defaultValue="1" />
                                </label>
                            </div>
                            <div className="admin-content-form-row">
                                <label>
                                    <span>{admin.labels.teacher}</span>
                                    <select name="teacherId" defaultValue={teacherOptions[0]?.id ?? ""}>
                                        {teacherOptions.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    <span>{admin.labels.classroom}</span>
                                    <select name="classroomId" defaultValue={classroomOptions[0]?.id ?? "0"}>
                                        <option value="0">{admin.labels.noClassroom}</option>
                                        {classroomOptions.map((classroom) => (
                                            <option key={classroom.id} value={classroom.id}>{classroom.name}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    <span>{admin.labels.secondClassroom}</span>
                                    <select name="secondaryClassroomId" defaultValue="0">
                                        <option value="0">{admin.labels.noSecondClassroom}</option>
                                        {classroomOptions.map((classroom) => (
                                            <option key={classroom.id} value={classroom.id}>{classroom.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="admin-content-row-actions right">
                                <AdminButton icon={Save} type="submit">{admin.actions.saveCourse}</AdminButton>
                            </div>
                        </form>
                    </>
                )}

                {selectedCourse && selectedCourseId !== "new" && (
                    <>
                        <div className="admin-content-panel-header">
                            <div>
                                <h3>{selectedCourse.title}</h3>
                                <span>{admin.labels.courseDetails}</span>
                            </div>
                            <div className="admin-content-row-actions">
                                <AdminButton form="admin-course-edit-form" icon={Save} type="submit" variant="ghost">{admin.actions.saveCourse}</AdminButton>
                                <AdminButton icon={Trash2} variant="danger" onClick={() => setCourseToDelete(selectedCourse)}>{admin.actions.deleteCourse}</AdminButton>
                            </div>
                        </div>

                        <form id="admin-course-edit-form" className="admin-content-details editable" onSubmit={submitUpdateCourse}>
                            <label>
                                <span>{admin.labels.professor}</span>
                                <select name="teacherId" defaultValue={selectedCourse.teacherId ?? ""}>
                                    {teacherOptions.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <span>{admin.labels.classroom}</span>
                                <select name="classroomId" defaultValue={selectedCourse.classroomId ?? 0}>
                                    <option value="0">{admin.labels.noClassroom}</option>
                                    {classroomOptions.map((classroom) => (
                                        <option key={classroom.id} value={classroom.id}>{classroom.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <span>{admin.labels.secondClassroom}</span>
                                <select name="secondaryClassroomId" defaultValue={selectedCourse.secondaryClassroomId ?? 0}>
                                    <option value="0">{admin.labels.noSecondClassroom}</option>
                                    {classroomOptions.map((classroom) => (
                                        <option key={classroom.id} value={classroom.id}>{classroom.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <span>{admin.labels.currentWeek}</span>
                                <input name="currentWeek" min="1" type="number" defaultValue={selectedCourse.currentWeek} />
                            </label>
                        </form>

                        <div className="admin-content-panel-subheader">
                            <h4>{admin.labels.courseUsers}</h4>
                            <form className="admin-content-code-add" onSubmit={submitAddCourseUser}>
                                <input name="code" placeholder={admin.labels.userCode} />
                                <AdminButton icon={UserPlus} type="submit" variant="ghost">{admin.actions.addUser}</AdminButton>
                            </form>
                        </div>

                        <div className="admin-content-list users">
                            {selectedCourse.users.map((user) => (
                                <div className="admin-content-user-row" key={`${selectedCourse.id}-${user.id}`}>
                                    <div>
                                        <strong>{user.name}</strong>
                                        <span>{user.code ? `${user.code} - ${user.email}` : user.email}</span>
                                    </div>
                                    <div className="admin-content-row-actions">
                                        <AdminStatus type={user.status}>{user.roleLabel}</AdminStatus>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {courseToDelete && (
                <ConfirmModal
                    title={admin.labels.deleteCourseTitle}
                    description={admin.labels.deleteCourseDescription(courseToDelete.title)}
                    cancelLabel={admin.actions.cancel}
                    confirmLabel={admin.actions.deleteCourse}
                    onCancel={() => setCourseToDelete(null)}
                    onConfirm={confirmDeleteCourse}
                />
            )}
        </div>
    );
}

function NewsPanel({ adminData, handleDeleteAnnouncement, handleSaveAnnouncement, handleUpdateAnnouncementStatus }) {
    const { admin, common, news } = usePreferenceTexts();
    const [selectedNewsId, setSelectedNewsId] = useState(adminData.news[0]?.id ?? "new");
    const selectedNews = selectedNewsId === "new"
        ? null
        : adminData.news.find((newsItem) => newsItem.id === selectedNewsId) ?? adminData.news[0] ?? null;
    const isDraft = !selectedNews || selectedNews.status === "draft";
    const isPublished = selectedNews?.status === "published";
    const selectedNewsIdValue = selectedNews?.id ?? null;

    async function submitNews(event) {
        event.preventDefault();
        await handleSaveAnnouncement(selectedNewsIdValue, getFormValues(event));
    }

    return (
        <div className="admin-content-grid two-columns">
            <div className="admin-content-panel">
                <div className="admin-content-panel-header">
                    <h3>{admin.sections.news}</h3>
                    <AdminButton icon={Plus} onClick={() => setSelectedNewsId("new")}>{admin.actions.newNews}</AdminButton>
                </div>
                <div className="admin-content-list">
                    {adminData.news.map((newsItem) => (
                        <button
                            key={newsItem.id}
                            type="button"
                            className={`admin-content-news ${newsItem.status} ${selectedNews?.id === newsItem.id ? "active" : ""}`}
                            onClick={() => setSelectedNewsId(newsItem.id)}
                        >
                            <strong>{newsItem.title}</strong>
                            <span>{newsItem.categoryLabel} - {newsItem.publishedAt}</span>
                            <AdminStatus type={newsItem.status}>{newsItem.statusLabel}</AdminStatus>
                        </button>
                    ))}
                </div>
            </div>

            <div className="admin-content-panel wide">
                <div className="admin-content-panel-header">
                    <div>
                        <h3>{admin.labels.newsEditor}</h3>
                        <span>{selectedNews ? selectedNews.title : admin.actions.newNews}</span>
                    </div>
                </div>

                <form className="admin-content-form" key={selectedNews?.id ?? "new"} onSubmit={submitNews}>
                    <label>
                        <span>{admin.labels.title}</span>
                        <input name="title" defaultValue={selectedNews?.title ?? ""} placeholder={news.untitled} />
                    </label>
                    <label>
                        <span>{admin.labels.body}</span>
                        <textarea name="body" defaultValue={selectedNews?.body ?? ""} placeholder={admin.empty.selectNews} />
                    </label>
                    <div className="admin-content-form-row">
                        <label>
                            <span>{admin.labels.category}</span>
                            <select name="category" defaultValue={selectedNews?.category ?? "general"}>
                                <option value="academic">{news.categories.academic}</option>
                                <option value="campus">{news.categories.campus ?? "Campus"}</option>
                                <option value="systems">{news.categories.systems ?? "Systems"}</option>
                                <option value="general">{news.categories.general}</option>
                            </select>
                        </label>
                        <label>
                            <span>{admin.labels.status}</span>
                            <select name="status" defaultValue={selectedNews?.status ?? "draft"}>
                                <option value="draft">{admin.statusLabels.draft}</option>
                                <option value="published">{admin.statusLabels.published}</option>
                                <option value="archived">{admin.statusLabels.archived}</option>
                            </select>
                        </label>
                    </div>
                    <div className="admin-content-row-actions right">
                        <AdminButton icon={Check} type="submit">{common.save}</AdminButton>
                        {selectedNews && isDraft && (
                            <AdminButton
                                icon={Check}
                                variant="ghost"
                                onClick={() => handleUpdateAnnouncementStatus(selectedNews.id, "published")}
                            >
                                {admin.actions.publishNews}
                            </AdminButton>
                        )}
                        {selectedNews && isPublished && (
                            <AdminButton
                                icon={Pencil}
                                variant="ghost"
                                onClick={() => handleUpdateAnnouncementStatus(selectedNews.id, "archived")}
                            >
                                {admin.actions.archiveNews}
                            </AdminButton>
                        )}
                        {selectedNews && (
                            <AdminButton
                                icon={Trash2}
                                variant="danger"
                                onClick={() => handleDeleteAnnouncement(selectedNews.id)}
                            >
                                {admin.actions.deleteNews}
                            </AdminButton>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

function UsersPanel({ adminData, handleToggleUserBlock }) {
    const { admin } = usePreferenceTexts();
    const [searchValue, setSearchValue] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(adminData.users[0]?.id ?? null);
    const filteredUsers = adminData.users.filter((user) => {
        const searchText = searchValue.trim().toLowerCase();

        if (!searchText) return true;

        return user.name.toLowerCase().includes(searchText)
            || user.code.toLowerCase().includes(searchText);
    });
    const selectedUser = useMemo(() => {
        return adminData.users.find((user) => user.id === selectedUserId) ?? adminData.users[0] ?? null;
    }, [adminData.users, selectedUserId]);
    const selectedUserCourses = selectedUser
        ? adminData.courses.filter((course) => course.users.some((user) => user.id === selectedUser.id))
        : [];
    const isCurrentUser = selectedUser?.id === adminData.currentUser?.id;

    return (
        <div className="admin-content-grid two-columns">
            <div className="admin-content-panel">
                <div className="admin-content-panel-header">
                    <h3>{admin.sections.users}</h3>
                </div>
                <div className="admin-content-search">
                    <input
                        value={searchValue}
                        placeholder={admin.labels.searchUser}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                </div>
                <div className="admin-content-list">
                    {filteredUsers.length === 0 && <AdminEmpty>{admin.empty.noUsers}</AdminEmpty>}
                    {filteredUsers.map((user) => (
                        <button
                            key={user.id}
                            type="button"
                            className={`admin-content-person ${selectedUser?.id === user.id ? "active" : ""}`}
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
            </div>

            <div className="admin-content-panel wide">
                {selectedUser && (
                    <>
                        <div className="admin-content-panel-header">
                            <div>
                                <h3>{selectedUser.name}</h3>
                                <span>{selectedUser.email}</span>
                            </div>
                            <div className="admin-content-row-actions">
                                {isCurrentUser && <AdminStatus>{admin.labels.currentSession}</AdminStatus>}
                                {!isCurrentUser && selectedUser.status === "blocked" && (
                                    <AdminButton
                                        icon={Unlock}
                                        variant="ghost"
                                        onClick={() => handleToggleUserBlock(selectedUser.id, false)}
                                    >
                                        {admin.actions.unblockUser}
                                    </AdminButton>
                                )}
                                {!isCurrentUser && selectedUser.status !== "blocked" && (
                                    <AdminButton
                                        icon={Lock}
                                        variant="danger"
                                        onClick={() => handleToggleUserBlock(selectedUser.id, true)}
                                    >
                                        {admin.actions.blockUser}
                                    </AdminButton>
                                )}
                            </div>
                        </div>

                        <div className="admin-content-details">
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
                                <strong>{selectedUser.statusLabel}</strong>
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

                        <div className="admin-content-panel-subheader">
                            <h4>{admin.labels.userActivity}</h4>
                        </div>

                        <div className="admin-content-list compact">
                            {selectedUserCourses.map((course) => (
                                <div className="admin-content-user-row" key={`${selectedUser.id}-${course.id}`}>
                                    <div>
                                        <strong>{course.title}</strong>
                                        <span>{course.professor}</span>
                                    </div>
                                    <div className="admin-content-row-actions">
                                        <AdminStatus>{course.shortName}</AdminStatus>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function AdminContent({ adminData, handleAddCourseUser, handleApproveDelegate, handleCreateCourse, handleDeleteAnnouncement, handleDeleteCourse, handleRejectDelegate, handleSaveAnnouncement, handleToggleUserBlock, handleUpdateAnnouncementStatus, handleUpdateCourse }) {
    const { admin } = usePreferenceTexts();
    const [activeSection, setActiveSection] = useState("security");
    const ActiveIcon = SECTION_ICONS[activeSection];

    const activeTitle = admin.sections[activeSection] ?? admin.title;

    return (
        <div className="admin-content">
            <div className="admin-content-header">
                <div>
                    <p>
                        <ActiveIcon />
                        {admin.eyebrow}
                    </p>
                    <h2>{activeTitle}</h2>
                    <span>{admin.description}</span>
                </div>
                <AdminSectionNav activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>

            {activeSection === "security" && (
                <SecurityPanel
                    adminData={adminData}
                    handleApproveDelegate={handleApproveDelegate}
                    handleRejectDelegate={handleRejectDelegate}
                />
            )}
            {activeSection === "courses" && (
                <CoursesPanel
                    adminData={adminData}
                    handleAddCourseUser={handleAddCourseUser}
                    handleCreateCourse={handleCreateCourse}
                    handleDeleteCourse={handleDeleteCourse}
                    handleUpdateCourse={handleUpdateCourse}
                />
            )}
            {activeSection === "news" && (
                <NewsPanel
                    adminData={adminData}
                    handleDeleteAnnouncement={handleDeleteAnnouncement}
                    handleSaveAnnouncement={handleSaveAnnouncement}
                    handleUpdateAnnouncementStatus={handleUpdateAnnouncementStatus}
                />
            )}
            {activeSection === "users" && (
                <UsersPanel
                    adminData={adminData}
                    handleToggleUserBlock={handleToggleUserBlock}
                />
            )}
        </div>
    );
}

export default AdminContent;
