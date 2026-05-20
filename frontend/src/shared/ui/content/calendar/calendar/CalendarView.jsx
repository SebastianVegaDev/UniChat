import "./CalendarView.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
import CalendarCreateOptions from "./create-options/CalendarCreateOptions.jsx";
import CalendarEventOptions from "./event-options/CalendarEventOptions.jsx";

function CalendarView({currentUser, course, events = [], handleCreateEvent, handleDeleteEvent}) {
    const [showOptions, setShowOptions] = useState(null);
    const eventOptionsRef = useRef(null);
    const calendarRef = useRef(null);
    const canCreateEvent = currentUser?.role === "teacher";

    function handleEventClick(info) {
        const eventType = info.event.extendedProps.eventType;

        if (eventType === "class") {
            setShowOptions(null);
            return;
        }

        const calendarRect = calendarRef.current.getBoundingClientRect();

        setShowOptions({
            id: info.event.id,
            x: info.jsEvent.clientX - calendarRect.left,
            y: info.jsEvent.clientY - calendarRect.top,
        });
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (eventOptionsRef.current && 
                !eventOptionsRef.current.contains(event.target)) 
            {
                setShowOptions(null);
            } 
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (
        <div className="calendar-view" ref={calendarRef}>
            {canCreateEvent && (
                <CalendarCreateOptions
                    course={course}
                    handleCreateEvent={handleCreateEvent}
                />
            )}
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height="100%"
                expandRows={true}
                fixedWeekCount={false}
                dayMaxEvents={2}
                events={events}
                eventClick={handleEventClick}
            />

            {showOptions && currentUser?.role === "teacher" && (
                <CalendarEventOptions
                    eventOptionsRef={eventOptionsRef}
                    position={showOptions}
                    handleDeleteEvent={handleDeleteEvent}
                />
            )}
        </div>
    );
}

export default CalendarView;
