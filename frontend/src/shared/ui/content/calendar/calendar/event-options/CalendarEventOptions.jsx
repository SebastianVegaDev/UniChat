import "./CalendarEventOptions.css";
import { useState } from "react";
import CreateForm from "../../../../forms/create/CreateForm.jsx";

function CalendarEventOptions({eventOptionsRef, position, course, closeOptions, handleEditEvent, handleCancelEvent, handleDeleteEvent}) {
    const [isEditing, setIsEditing] = useState(false);

    function editEvent() {
        setIsEditing(true);
    }

    function cancelEvent() {
        handleCancelEvent({
            calendarEventId: position.id
        });

        closeOptions();
    }

    function deleteEvent() {
        handleDeleteEvent({
            calendarEventId: position.id
        });

        closeOptions();
    }

    return (
        <div
            ref={eventOptionsRef}
            className="calendar-event-options"
            style={{
                top: position.y,
                left: position.x,
            }}
            onClick={(event) => event.stopPropagation()}
        >
            <p className="calendar-event-option" onClick={editEvent}>Edit</p>
            <p className="calendar-event-option" onClick={cancelEvent}>Cancel</p>
            <p className="calendar-event-option" onClick={deleteEvent}>Delete</p>

            {isEditing && (
                <CreateForm
                    closeForm={() => {
                        setIsEditing(false);
                        closeOptions();
                    }}
                    course={course}
                    calendarEvent={position.event}
                    handleEditEvent={handleEditEvent}
                />
            )}
        </div>
    );
}

export default CalendarEventOptions;
