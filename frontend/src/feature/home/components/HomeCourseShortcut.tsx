import "./HomeCourseShortcut.css";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function HomeCourseShortcut({ course }) {
    return (
        <Link to={course.route} className="home-course-shortcut">
            <div className="home-course-shortcut-main">
                <span className="home-course-shortcut-icon">{course.shortName}</span>

                <div className="home-course-shortcut-info">
                    <strong>{course.title}</strong>
                    <span>{course.teacher}</span>
                    <span>{course.classroom}</span>
                </div>
            </div>

            <ChevronRight />
        </Link>
    );
}

export default HomeCourseShortcut;