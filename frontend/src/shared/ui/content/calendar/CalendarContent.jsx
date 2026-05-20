import "./CalendarContent.css";
import CalendarView from "./calendar/CalendarView.jsx";
import CalendarPending from "./pending/CalendarPending.jsx";

function CalendarContent({currentUser, course, events, pendingItems, handleCreateEvent, handleDeleteEvent}) {
    return (
        <div className="calendar-content">
            <CalendarView 
                currentUser={currentUser}
                course={course}
                events={events}
                handleCreateEvent={handleCreateEvent}
                handleDeleteEvent={handleDeleteEvent}
            />
            <CalendarPending 
                pendingItems={pendingItems}
            />
        </div>
    );
}

export default CalendarContent;
