import "./CourseInformationPanel.css";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import CourseDelegateRequest from "./CourseDelegateRequest.jsx";
import CourseInfoRow from "./CourseInfoRow.jsx";

function CourseInformationPanel({ currentUser, course: courseData, information, delegateCandidates = [], handleRequestDelegate }) {
    const { course } = usePreferenceTexts();
    const isTeacher = currentUser?.role === "teacher";

    return (
        <section className="course-information-panel course-card">
            <div className="course-card-header">
                <h3>{course.information}</h3>
            </div>

            <div className="course-information-week">
                <h3>{information.currentWeek}</h3>
                <h4>{course.currentWeek}</h4>
            </div>

            <div className="course-information-details">
                <CourseInfoRow label={course.professor} value={information.professor} />
                <CourseInfoRow label={course.delegates} value={information.delegates} />
                <CourseInfoRow label={course.activity} value={information.activity} />
            </div>

            {isTeacher && (
                <CourseDelegateRequest
                    course={courseData}
                    delegateCandidates={delegateCandidates}
                    handleRequestDelegate={handleRequestDelegate}
                />
            )}
        </section>
    );
}

export default CourseInformationPanel;