import "./CourseCalendarView.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
import CalendarCreateAction from "./CalendarCreateAction.jsx";
import CalendarEventMenu from "./CalendarEventMenu.jsx";
import {
    getCalendarEventMenuPosition,
    getEditableCalendarEvent,
    isClassCalendarEvent
} from "../helpers/calendarEvents.js";

function CourseCalendarView({ currentUser, course, events = [], handleCreateEvent, handleEditEvent, handleCancelEvent, handleDeleteEvent }) {
    const [eventMenu, setEventMenu] = useState(null);
    const eventOptionsRef = useRef(null);
    const calendarRef = useRef(null);
    const canManageEvents = currentUser?.role === "teacher";

    function handleEventClick(info) {
        if (isClassCalendarEvent(info)) {
            setEventMenu(null);
            return;
        }

        setEventMenu({
            id: info.event.id,
            event: getEditableCalendarEvent(info),
            ...getCalendarEventMenuPosition(info, calendarRef.current)
        });
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (eventOptionsRef.current && !eventOptionsRef.current.contains(event.target)) {
                setEventMenu(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <section className="course-calendar-view" ref={calendarRef}>
            {canManageEvents && (
                <CalendarCreateAction
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

            {eventMenu && canManageEvents && (
                <CalendarEventMenu
                    eventOptionsRef={eventOptionsRef}
                    position={eventMenu}
                    course={course}
                    closeOptions={() => setEventMenu(null)}
                    handleEditEvent={handleEditEvent}
                    handleCancelEvent={handleCancelEvent}
                    handleDeleteEvent={handleDeleteEvent}
                />
            )}
        </section>
    );
}

export default CourseCalendarView;