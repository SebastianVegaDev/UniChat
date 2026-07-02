import "./CourseHero.css";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import StatusPill from "../../../shared/ui/primitives/status/StatusPill.jsx";

function CourseHero({ course }) {
    const { course: courseTexts } = usePreferenceTexts();

    return (
        <header className="course-hero">
            <span className="course-hero-icon">{course.shortName}</span>

            <div className="course-hero-info">
                <p>{courseTexts.course}</p>
                <h1>{course.title}</h1>
                <h3>{course.teacher} · {course.classroom}</h3>

                <div className="course-hero-badges">
                    <StatusPill>{course.studentsCount} {courseTexts.students}</StatusPill>
                    <StatusPill>{course.delegatesCount} {courseTexts.delegates}</StatusPill>
                    <StatusPill>{course.lastActivityLabel}</StatusPill>
                </div>
            </div>
        </header>
    );
}

export default CourseHero;