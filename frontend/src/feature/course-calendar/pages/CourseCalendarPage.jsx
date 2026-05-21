import { CalendarDays } from "lucide-react";
import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import CalendarContent from "../../../shared/ui/content/calendar/CalendarContent.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import {
    addCalendarEvent,
    cancelCalendarEvent,
    editCalendarEvent,
    removeCalendarEvent
} from "../../bootstrap/updaters/bootstrap.updaters.js";
import { mapCourseCalendarData } from "../mappers/courseCalendar.mapper.js";
import {
    fetchCancelTeacherCalendarEvent,
    fetchCreateTeacherCalendarEvent,
    fetchDeleteTeacherCalendarEvent,
    fetchEditTeacherCalendarEvent
} from "../api/teacherCalendarEvents.api.js";
import { useParams } from "react-router-dom";

function CourseCalendarPage() {
    const { data, updateBootstrap, isLoading, error } = useBootstrap();
    const { courseSlug } = useParams();

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    const courseCalendarData = mapCourseCalendarData(data, courseSlug);
    const { course, currentUser, events, pendingItems } = courseCalendarData;

    async function handleCreateEvent(calendarEventData) {
        try {
            const createdEvent = await fetchCreateTeacherCalendarEvent(calendarEventData);

            if (createdEvent) {
                updateBootstrap((currentData) => addCalendarEvent(currentData, {
                    ...calendarEventData,
                    id: createdEvent.id,
                    status: "pending"
                }));
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleEditEvent(calendarEventData) {
        try {
            const editedEvent = await fetchEditTeacherCalendarEvent(calendarEventData);

            if (editedEvent) {
                updateBootstrap((currentData) => editCalendarEvent(currentData, calendarEventData));
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleCancelEvent(calendarEventData) {
        try {
            const canceledEvent = await fetchCancelTeacherCalendarEvent(calendarEventData);

            if (canceledEvent) {
                updateBootstrap((currentData) => cancelCalendarEvent(currentData, calendarEventData.calendarEventId));
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteEvent(calendarEventData) {
        try {
            const deletedEvent = await fetchDeleteTeacherCalendarEvent(calendarEventData);

            if (deletedEvent) {
                updateBootstrap((currentData) => removeCalendarEvent(currentData, calendarEventData.calendarEventId));
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <SectionLayout>
            <SectionHero
                eyebrow={<><CalendarDays /> Calendar</>}
                title={"Calendar"}
                description={"Upcoming classes, assignments, and academic events."}
            />
            <CalendarContent 
                currentUser={currentUser}
                course={course}
                events={events}
                pendingItems={pendingItems}
                handleCreateEvent={handleCreateEvent}
                handleEditEvent={handleEditEvent}
                handleCancelEvent={handleCancelEvent}
                handleDeleteEvent={handleDeleteEvent}
            />
        </SectionLayout>
    );
}

export default CourseCalendarPage;
