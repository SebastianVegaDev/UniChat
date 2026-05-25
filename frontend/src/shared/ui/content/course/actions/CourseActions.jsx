import "./CourseActions.css";
import { CalendarDays, ChevronRight, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { usePreferenceTexts } from "../../../../../feature/preferences/context/PreferencesContext.js";

function CourseActions({actions}) {
    const { course } = usePreferenceTexts();

    return (
        <div className="course-actions">
            <NavLink to={actions.chatRoute} className="course-action course-action-chat">
                <div className="course-action-info">
                    <span className="course-action-icon"><MessageCircle /></span>
                    <div>
                        <p>{course.courseChat}</p>
                        <span>{actions.chatMetaLabel}</span>
                    </div>
                </div>
                <span className="course-action-button"><ChevronRight /></span>
            </NavLink>
            <NavLink to={actions.calendarRoute} className="course-action course-action-calendar">
                <div className="course-action-info">
                    <span className="course-action-icon"><CalendarDays /></span>
                    <div>
                        <p>{course.calendar}</p>
                        <span>{actions.calendarMetaLabel}</span>
                    </div>
                </div>
                <span className="course-action-button"><ChevronRight /></span>
            </NavLink>
        </div>
    );
}

export default CourseActions;
