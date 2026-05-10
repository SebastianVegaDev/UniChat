import "./HomeQuickAccess.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function HomeQuickAccess({courses}) {
    const [start, setStart] = useState(0);

    const visibleCourses = courses.slice(start, start + 4);
    const canMoveBack = start > 0;
    const canMoveNext = start + 4 < courses.length;
    return (
        <div className="home-quick-access">
            <div className="home-quick-access-list">
                {visibleCourses.map((course) => (
                    <Link to={course.route} className="home-quick-access-course" key={course.id}>
                        <div>
                            <span className="home-quick-access-course-icon">{course.shortName}</span>
                            <div>
                                <p className="home-quick-access-course-title">{course.title}</p>
                                <p className="home-quick-access-course-teacher">{course.teacher}</p>
                                <p className="home-quick-access-course-teacher">{course.classroom}</p>
                            </div>
                        </div>
                        <ChevronRight />
                    </Link>
                ))}
            </div>
            {canMoveBack && (
                <button className="home-quick-access-back" onClick={() => setStart(start - 1)}>
                    <ChevronLeft />
                </button>
            )}
            {canMoveNext && (
                <button className="home-quick-access-next" onClick={() => setStart(start + 1)}>
                    <ChevronRight />
                </button>
            )}
        </div>
    );
}

export default HomeQuickAccess;
