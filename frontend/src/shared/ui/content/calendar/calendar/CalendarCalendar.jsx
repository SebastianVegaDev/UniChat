import "./CalendarCalendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function CalendarCalendar() {
    return (
        <div className="calendar-calendar">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height="100%"
                expandRows={true}
                fixedWeekCount={false}
                dayMaxEvents={2}
                events={[
                    { title: "Programming exam", date: "2026-05-10" },
                    { title: "Project submission", date: "2026-05-15" },
                ]}
            />
        </div>
    );
}

export default CalendarCalendar;
