import "./CalendarCalendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function CalendarCalendar({events = []}) {
    return (
        <div className="calendar-calendar">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height="100%"
                expandRows={true}
                fixedWeekCount={false}
                dayMaxEvents={2}
                events={events}
            />
        </div>
    );
}

export default CalendarCalendar;
