import "./AdminCoursesPanel.css";
import { Plus, Save, Trash2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import AppButton from "../../../../shared/ui/primitives/button/AppButton.jsx";
import EmptyText from "../../../../shared/ui/primitives/empty/EmptyText.jsx";
import StatusPill from "../../../../shared/ui/primitives/status/StatusPill.jsx";
import ConfirmDialog from "../../../../shared/ui/primitives/modal/ConfirmDialog.jsx";
import { getFormValues } from "../../helpers/adminForms.js";
import { findSelectedCourse } from "../../helpers/adminSelectors.js";

function AdminCoursesPanel({ adminData, handleAddCourseUser, handleCreateCourse, handleDeleteCourse, handleUpdateCourse }) {
    const { admin } = usePreferenceTexts();
    const [selectedCourseId, setSelectedCourseId] = useState(adminData.courses[0]?.id ?? "new");
    const [courseToDelete, setCourseToDelete] = useState(null);
    const selectedCourse = useMemo(() => {
        return findSelectedCourse(adminData.courses, selectedCourseId);
    }, [adminData.courses, selectedCourseId]);
    const teacherOptions = adminData.teachers;
    const classroomOptions = adminData.classrooms;
    const isCreating = selectedCourseId === "new";

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
        <div className="admin-courses-panel">
            <section className="admin-card admin-course-list-card">
                <div className="admin-card-header">
                    <h3>{admin.labels.courseList}</h3>
                    <AppButton icon={Plus} size="sm" variant="soft" onClick={() => setSelectedCourseId("new")}>
                        {admin.actions.createCourse}
                    </AppButton>
                </div>

                <div className="admin-course-list">
                    <button
                        type="button"
                        className={`admin-course-option ${isCreating ? "active" : ""}`}
                        onClick={() => setSelectedCourseId("new")}
                    >
                        <span>+</span>
                        <div>
                            <strong>{admin.labels.createCourse}</strong>
                            <small>{admin.actions.createCourse}</small>
                        </div>
                    </button>

                    {adminData.courses.length === 0 && (
                        <EmptyText>{admin.empty.noCourses}</EmptyText>
                    )}

                    {adminData.courses.map((course) => (
                        <button
                            key={course.id}
                            type="button"
                            className={`admin-course-option ${selectedCourse?.id === course.id && !isCreating ? "active" : ""}`}
                            onClick={() => setSelectedCourseId(course.id)}
                        >
                            <span>{course.shortName}</span>
                            <div>
                                <strong>{course.title}</strong>
                                <small>{course.membersCount} {admin.labels.members}</small>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="admin-card admin-course-detail-card">
                {isCreating && (
                    <form className="admin-form" onSubmit={submitCreateCourse}>
                        <div className="admin-card-header">
                            <div>
                                <h3>{admin.labels.createCourse}</h3>
                                <span>{admin.labels.courseDetails}</span>
                            </div>
                            <AppButton icon={Save} type="submit">
                                {admin.actions.saveCourse}
                            </AppButton>
                        </div>

                        <div className="admin-form-grid">
                            <label>
                                <span>{admin.labels.shortName}</span>
                                <input name="shortName" placeholder="SO" />
                            </label>

                            <label>
                                <span>{admin.labels.title}</span>
                                <input name="title" placeholder={admin.labels.createCourse} />
                            </label>

                            <label>
                                <span>{admin.labels.slug}</span>
                                <input name="slug" placeholder="sistemas-operativos" />
                            </label>

                            <label>
                                <span>{admin.labels.currentWeek}</span>
                                <input name="currentWeek" min="1" type="number" defaultValue="1" />
                            </label>

                            <label>
                                <span>{admin.labels.teacher}</span>
                                <select name="teacherId" defaultValue={teacherOptions[0]?.id ?? ""}>
                                    {teacherOptions.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>{admin.labels.classroom}</span>
                                <select name="classroomId" defaultValue={classroomOptions[0]?.id ?? "0"}>
                                    <option value="0">{admin.labels.noClassroom}</option>
                                    {classroomOptions.map((classroom) => (
                                        <option key={classroom.id} value={classroom.id}>
                                            {classroom.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>{admin.labels.secondClassroom}</span>
                                <select name="secondaryClassroomId" defaultValue="0">
                                    <option value="0">{admin.labels.noSecondClassroom}</option>
                                    {classroomOptions.map((classroom) => (
                                        <option key={classroom.id} value={classroom.id}>
                                            {classroom.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </form>
                )}

                {selectedCourse && !isCreating && (
                    <>
                        <form className="admin-form" onSubmit={submitUpdateCourse}>
                            <div className="admin-card-header">
                                <div>
                                    <h3>{selectedCourse.title}</h3>
                                    <span>{admin.labels.courseDetails}</span>
                                </div>

                                <div className="admin-row-actions">
                                    <AppButton icon={Save} type="submit" variant="soft">
                                        {admin.actions.saveCourse}
                                    </AppButton>

                                    <AppButton icon={Trash2} variant="danger" onClick={() => setCourseToDelete(selectedCourse)}>
                                        {admin.actions.deleteCourse}
                                    </AppButton>
                                </div>
                            </div>

                            <div className="admin-form-grid">
                                <label>
                                    <span>{admin.labels.professor}</span>
                                    <select name="teacherId" defaultValue={selectedCourse.teacherId ?? ""}>
                                        {teacherOptions.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    <span>{admin.labels.classroom}</span>
                                    <select name="classroomId" defaultValue={selectedCourse.classroomId ?? 0}>
                                        <option value="0">{admin.labels.noClassroom}</option>
                                        {classroomOptions.map((classroom) => (
                                            <option key={classroom.id} value={classroom.id}>
                                                {classroom.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    <span>{admin.labels.secondClassroom}</span>
                                    <select name="secondaryClassroomId" defaultValue={selectedCourse.secondaryClassroomId ?? 0}>
                                        <option value="0">{admin.labels.noSecondClassroom}</option>
                                        {classroomOptions.map((classroom) => (
                                            <option key={classroom.id} value={classroom.id}>
                                                {classroom.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    <span>{admin.labels.currentWeek}</span>
                                    <input name="currentWeek" min="1" type="number" defaultValue={selectedCourse.currentWeek} />
                                </label>
                            </div>
                        </form>

                        <div className="admin-course-users">
                            <div className="admin-course-users-header">
                                <h4>{admin.labels.courseUsers}</h4>

                                <form className="admin-inline-form" onSubmit={submitAddCourseUser}>
                                    <input name="code" placeholder={admin.labels.userCode} />
                                    <AppButton icon={UserPlus} size="sm" type="submit" variant="secondary">
                                        {admin.actions.addUser}
                                    </AppButton>
                                </form>
                            </div>

                            <div className="admin-list">
                                {selectedCourse.users.map((user) => (
                                    <article className="admin-list-row" key={`${selectedCourse.id}-${user.id}`}>
                                        <div className="admin-list-row-main">
                                            <strong>{user.name}</strong>
                                            <span>{user.code ? `${user.code} - ${user.email}` : user.email}</span>
                                        </div>

                                        <StatusPill type={user.status}>
                                            {user.roleLabel}
                                        </StatusPill>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </section>

            {courseToDelete && (
                <ConfirmDialog
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

export default AdminCoursesPanel;