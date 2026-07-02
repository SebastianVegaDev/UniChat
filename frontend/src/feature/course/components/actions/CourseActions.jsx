import "./CourseActions.css";
import { CalendarDays, MessageCircle } from "lucide-react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import CourseActionCard from "./CourseActionCard.jsx";

function CourseActions({ actions }) {
    const { course } = usePreferenceTexts();

    return (
        <div className="course-actions">
            <CourseActionCard
                icon={MessageCircle}
                route={actions.chatRoute}
                title={course.courseChat}
                description={actions.chatMetaLabel}
                variant="default"
            />

            <CourseActionCard
                icon={CalendarDays}
                route={actions.calendarRoute}
                title={course.calendar}
                description={actions.calendarMetaLabel}
                variant="accent"
            />
        </div>
    );
}

export default CourseActions;