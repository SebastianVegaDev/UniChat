import "./CourseActions.css";
import { CalendarDays, ChevronRight, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

function CourseActions() {
    return (
        <div className="course-actions">
            <NavLink to="/course/mate/chat" className="course-action course-action-chat">
                <div className="course-action-info">
                    <span className="course-action-icon"><MessageCircle /></span>
                    <div>
                        <p>Course chat</p>
                        <span>Enter and select channel</span>
                    </div>
                </div>
                <span className="course-action-button"><ChevronRight /></span>
            </NavLink>
            <NavLink to="/course/mate/calendar" className="course-action course-action-calendar">
                <div className="course-action-info">
                    <span className="course-action-icon"><CalendarDays /></span>
                    <div>
                        <p>Calendar</p>
                        <span>4 pending this month</span>
                    </div>
                </div>
                <span className="course-action-button"><ChevronRight /></span>
            </NavLink>
        </div>
    );
}

export default CourseActions;
