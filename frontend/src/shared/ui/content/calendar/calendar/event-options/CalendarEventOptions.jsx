import "./CalendarEventOptions.css";

function CalendarEventOptions({eventOptionsRef, position}) {
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
            <p className="calendar-event-option">Edit</p>
            <p className="calendar-event-option">Delete</p>
        </div>
    );
}

export default CalendarEventOptions;
