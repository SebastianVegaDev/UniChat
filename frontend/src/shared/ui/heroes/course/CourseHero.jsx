import "./CourseHero.css";

function CourseHero() {
    return (
        <div className="course-hero">
            <span className="course-hero-icon">UX</span>
            <div className="course-hero-info">
                <p>Course</p>
                <h1>UX Design</h1>
                <h3>Prof. Andrea Salas · Room 405 · 08:00 - 09:40</h3>
                <div className="course-hero-badges">
                    <span>28 students</span>
                    <span>2 delegates</span>
                    <span>Updated 18 min ago</span>
                </div>
            </div>
        </div>
    );
}

export default CourseHero;
