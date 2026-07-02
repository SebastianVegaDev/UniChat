import "./CourseCalendarView.css";
import FullCalendar from "@fullcalendar/react";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import CalendarCreateAction from "./CalendarCreateAction.jsx";
import CalendarEventMenu from "./CalendarEventMenu.jsx";
import {
    getCalendarEventMenuPosition,
    getEditableCalendarEvent,
    isClassCalendarEvent
} from "../helpers/calendarEvents.js";
import type { Course, Dictionary, User } from "../../../shared/types/app.types.js";

interface CalendarMenuState {
    id: string;
    event: Dictionary;
    x: number;
    y: number;
}

interface CourseCalendarViewProps {
    currentUser?: User | null;
    course: Course;
    events?: EventInput[];
    handleCreateEvent: (payload: Dictionary) => Promise<boolean>;
    handleEditEvent: (payload: Dictionary) => Promise<boolean>;
    handleCancelEvent: (payload: Dictionary) => Promise<boolean>;
    handleDeleteEvent: (payload: Dictionary) => Promise<boolean>;
}

function CourseCalendarView({
    currentUser,
    course,
    events = [],
    handleCreateEvent,
    handleEditEvent,
    handleCancelEvent,
    handleDeleteEvent
}: CourseCalendarViewProps) {
    const [eventMenu, setEventMenu] = useState<CalendarMenuState | null>(null);
    const eventOptionsRef = useRef<HTMLDivElement | null>(null);
    const calendarRef = useRef<HTMLElement | null>(null);
    const canManageEvents = currentUser?.role === "teacher";

    function handleEventClick(info: EventClickArg): void {
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
        function handleClickOutside(event: MouseEvent): void {
            if (eventOptionsRef.current && event.target instanceof Node && !eventOptionsRef.current.contains(event.target)) {
                setEventMenu(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <section className="course-calendar-view" ref={calendarRef as RefObject<HTMLElement>}>
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
