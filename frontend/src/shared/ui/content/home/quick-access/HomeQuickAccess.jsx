import "./HomeQuickAccess.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

function HomeQuickAccess() {
    const [start, setStart] = useState(0);

    const courses = [
        {
            shortName: "Ux",
            title: "Diseno UX",
            teacher: "Proff. Andrea",
            classroom: "Aula 303",
        },
        {
            shortName: "Ux",
            title: "Diseno UX",
            teacher: "Proff. Andrea",
            classroom: "Aula 303",
        },
        {
            shortName: "Ux",
            title: "Diseno UX",
            teacher: "Proff. Andrea",
            classroom: "Aula 303",
        },
        {
            shortName: "Ux",
            title: "Diseno UX",
            teacher: "Proff. Andrea",
            classroom: "Aula 303",
        },
        {
            shortName: "Ux",
            title: "Diseno USSX",
            teacher: "Proff. Andrea",
            classroom: "Aula 303",
        },
    ];

    const visibleCourses = courses.slice(start, start + 4);
    const canMoveBack = start > 0;
    const canMoveNext = start + 4 < courses.length;

    return (
        <div className="home-quick-access">
            <div className="home-quick-access-list">
                {visibleCourses.map((course) => (
                    <div className="home-quick-access-course" key={course.title}>
                        <div>
                            <span className="home-quick-access-course-icon">{course.shortName}</span>
                            <div>
                                <p className="home-quick-access-course-title">{course.title}</p>
                                <p className="home-quick-access-course-teacher">{course.teacher}</p>
                                <p className="home-quick-access-course-classroom">{course.classroom}</p>
                            </div>
                        </div>
                        <button><ChevronRight /></button>
                    </div>
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
