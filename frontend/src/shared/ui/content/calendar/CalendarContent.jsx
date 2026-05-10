import "./CalendarContent.css";
import CalendarCalendar from "./calendar/CalendarCalendar.jsx";
import CalendarPending from "./pending/CalendarPending.jsx";

function CalendarContent({events, pendingItems}) {
    return (
        <div className="calendar-content">
            <CalendarCalendar 
                events={events}
            />
            <CalendarPending 
                pendingItems={pendingItems}
            />
        </div>
    );
}

export default CalendarContent;
