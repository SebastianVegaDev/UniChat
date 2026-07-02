import "./HomeQuickAccess.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import EmptyText from "../../../shared/ui/primitives/empty/EmptyText.jsx";
import HomeCourseShortcut from "./HomeCourseShortcut.jsx";
import {
    canMoveQuickAccessBack,
    canMoveQuickAccessNext,
    getNextQuickAccessStart,
    getPreviousQuickAccessStart,
    getVisibleQuickAccessItems
} from "../helpers/homeQuickAccess.js";

function HomeQuickAccess({ courses }) {
    const [start, setStart] = useState(0);
    const visibleCourses = getVisibleQuickAccessItems(courses, start);
    const canMoveBack = canMoveQuickAccessBack(start);
    const canMoveNext = canMoveQuickAccessNext(courses, start);

    return (
        <section className="home-quick-access">
            {courses.length === 0 && (
                <EmptyText>No tienes cursos disponibles.</EmptyText>
            )}

            {courses.length > 0 && (
                <>
                    <div className="home-quick-access-list">
                        {visibleCourses.map((course) => (
                            <HomeCourseShortcut key={course.id} course={course} />
                        ))}
                    </div>

                    {canMoveBack && (
                        <button
                            className="home-quick-access-control previous"
                            type="button"
                            onClick={() => setStart((currentStart) => getPreviousQuickAccessStart(currentStart))}
                        >
                            <ChevronLeft />
                        </button>
                    )}

                    {canMoveNext && (
                        <button
                            className="home-quick-access-control next"
                            type="button"
                            onClick={() => setStart((currentStart) => getNextQuickAccessStart(courses, currentStart))}
                        >
                            <ChevronRight />
                        </button>
                    )}
                </>
            )}
        </section>
    );
}

export default HomeQuickAccess;