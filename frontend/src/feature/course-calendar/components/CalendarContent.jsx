import "./CalendarContent.css";
import CalendarPendingPanel from "./CalendarPendingPanel.jsx";
import CourseCalendarView from "./CourseCalendarView.jsx";

function CalendarContent({ currentUser, course, events, pendingItems, handleCreateEvent, handleEditEvent, handleCancelEvent, handleDeleteEvent }) {
    return (
        <div className="calendar-content">
            <CourseCalendarView
                currentUser={currentUser}
                course={course}
                events={events}
                handleCreateEvent={handleCreateEvent}
                handleEditEvent={handleEditEvent}
                handleCancelEvent={handleCancelEvent}
                handleDeleteEvent={handleDeleteEvent}
            />

            <CalendarPendingPanel pendingItems={pendingItems} />
        </div>
    );
}

export default CalendarContent;