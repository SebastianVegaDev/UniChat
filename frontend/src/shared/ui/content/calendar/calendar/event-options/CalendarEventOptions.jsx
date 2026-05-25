import "./CalendarEventOptions.css";
import { useState } from "react";
import CreateForm from "../../../../forms/create/CreateForm.jsx";
import { usePreferenceTexts } from "../../../../../../feature/preferences/context/PreferencesContext.js";

function CalendarEventOptions({eventOptionsRef, position, course, closeOptions, handleEditEvent, handleCancelEvent, handleDeleteEvent}) {
    const [isEditing, setIsEditing] = useState(false);
    const { common } = usePreferenceTexts();

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
            <p className="calendar-event-option" onClick={editEvent}>{common.edit}</p>
            <p className="calendar-event-option" onClick={cancelEvent}>{common.cancel}</p>
            <p className="calendar-event-option" onClick={deleteEvent}>{common.delete}</p>

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
