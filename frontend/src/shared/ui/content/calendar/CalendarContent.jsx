import "./CalendarContent.css";
import CalendarCalendar from "./calendar/CalendarCalendar.jsx";
import CalendarPending from "./pending/CalendarPending.jsx";

function CalendarContent() {
    return (
        <div className="calendar-content">
            <CalendarCalendar />
            <CalendarPending />
        </div>
    );
}

export default CalendarContent;
