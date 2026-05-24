import "./CourseHero.css";
import { usePreferenceTexts } from "../../../../feature/preferences/context/PreferencesContext.js";

function CourseHero({course}) {
    const { course: courseTexts } = usePreferenceTexts();

    return (
        <div className="course-hero">
            <span className="course-hero-icon">{course.shortName}</span>
            <div className="course-hero-info">
                <p>{courseTexts.course}</p>
                <h1>{course.title}</h1>
                <h3>{course.teacher} · {course.classroom}</h3>
                <div className="course-hero-badges">
                    <span>{course.studentsCount} {courseTexts.students}</span>
                    <span>{course.delegatesCount} {courseTexts.delegates}</span>
                    <span>{course.lastActivityLabel}</span>
                </div>
            </div>
        </div>
    );
}

export default CourseHero;
