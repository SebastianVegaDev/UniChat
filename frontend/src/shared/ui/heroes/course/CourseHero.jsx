import "./CourseHero.css";

function CourseHero({course}) {
    return (
        <div className="course-hero">
            <span className="course-hero-icon">{course.shortName}</span>
            <div className="course-hero-info">
                <p>Course</p>
                <h1>{course.title}</h1>
                <h3>{course.teacher} · {course.classroom}</h3>
                <div className="course-hero-badges">
                    <span>{course.studentsCount} students</span>
                    <span>{course.delegatesCount} delegates</span>
                    <span>{course.lastActivityLabel}</span>
                </div>
            </div>
        </div>
    );
}

export default CourseHero;
