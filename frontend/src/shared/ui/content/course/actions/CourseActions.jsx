import "./CourseActions.css";
import { CalendarDays, ChevronRight, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

function CourseActions({actions}) {
    return (
        <div className="course-actions">
            <NavLink to={actions.chatRoute} className="course-action course-action-chat">
                <div className="course-action-info">
                    <span className="course-action-icon"><MessageCircle /></span>
                    <div>
                        <p>Course chat</p>
                        <span>{actions.chatMetaLabel}</span>
                    </div>
                </div>
                <span className="course-action-button"><ChevronRight /></span>
            </NavLink>
            <NavLink to={actions.calendarRoute} className="course-action course-action-calendar">
                <div className="course-action-info">
                    <span className="course-action-icon"><CalendarDays /></span>
                    <div>
                        <p>Calendar</p>
                        <span>{actions.calendarMetaLabel}</span>
                    </div>
                </div>
                <span className="course-action-button"><ChevronRight /></span>
            </NavLink>
        </div>
    );
}

export default CourseActions;
