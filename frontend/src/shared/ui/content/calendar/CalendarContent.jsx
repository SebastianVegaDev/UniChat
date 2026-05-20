import "./CalendarContent.css";
import CalendarView from "./calendar/CalendarView.jsx";
import CalendarPending from "./pending/CalendarPending.jsx";

function CalendarContent({currentUser, events, pendingItems}) {
    return (
        <div className="calendar-content">
            <CalendarView 
                currentUser={currentUser}
                events={events}
            />
            <CalendarPending 
                pendingItems={pendingItems}
            />
        </div>
    );
}

export default CalendarContent;
