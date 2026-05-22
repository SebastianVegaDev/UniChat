import "./CalendarContent.css";
import CalendarView from "./calendar/CalendarView.jsx";
import CalendarPending from "./pending/CalendarPending.jsx";

function CalendarContent({currentUser, course, events, pendingItems, handleCreateEvent, handleEditEvent, handleCancelEvent, handleDeleteEvent}) {
    return (
        <div className="calendar-content">
            <CalendarView 
                currentUser={currentUser}
                course={course}
                events={events}
                handleCreateEvent={handleCreateEvent}
                handleEditEvent={handleEditEvent}
                handleCancelEvent={handleCancelEvent}
                handleDeleteEvent={handleDeleteEvent}
            />
            <CalendarPending 
                pendingItems={pendingItems}
            />
        </div>
    );
}

export default CalendarContent;
