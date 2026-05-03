import "./CourseActions.css";
import { CalendarDays, ChevronRight, MessageCircle } from "lucide-react";

function CourseActions() {
    return (
        <div className="course-actions">
            <div className="course-action-chat">
                <div className="course-action-info">
                    <span className="course-action-icon"><MessageCircle /></span>
                    <div>
                        <p>Course chat</p>
                        <span>Enter and select channel</span>
                    </div>
                </div>
                <button className="course-action-button"><ChevronRight /></button>
            </div>
            <div className="course-action-calendar">
                <div className="course-action-info">
                    <span className="course-action-icon"><CalendarDays /></span>
                    <div>
                        <p>Calendar</p>
                        <span>4 pending this month</span>
                    </div>
                </div>
                <button className="course-action-button"><ChevronRight /></button>
            </div>
        </div>
    );
}

export default CourseActions;
