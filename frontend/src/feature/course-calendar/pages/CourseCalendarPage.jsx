import { CalendarDays } from "lucide-react";
import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import CalendarContent from "../../../shared/ui/content/calendar/CalendarContent.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { useBootstrapData } from "../../bootstrap/hooks/useBootstrapData.js";
import { saveBootstrapCache } from "../../bootstrap/cache/bootstrap.cache.js";
import { mapCourseCalendarData } from "../mappers/courseCalendar.mapper.js";
import {
    fetchCreateTeacherCalendarEvent,
    fetchDeleteTeacherCalendarEvent
} from "../api/teacherCalendarEvents.api.js";
import { useParams } from "react-router-dom";

function CourseCalendarPage() {
    const { data, setData, isLoading, error } = useBootstrapData();
    const { courseSlug } = useParams();

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    const courseCalendarData = mapCourseCalendarData(data, courseSlug);
    const { course, currentUser, events, pendingItems } = courseCalendarData;

    async function handleCreateEvent(calendarEventData) {
        try {
            const createdEvent = await fetchCreateTeacherCalendarEvent(calendarEventData);

            if (createdEvent) {
                setData((currentData) => {
                    if (!currentData) return currentData;

                    const nextData = {
                        ...currentData,
                        calendarEvents: [
                            ...(currentData.calendarEvents ?? []),
                            {
                                ...calendarEventData,
                                id: createdEvent.id,
                                status: "pending"
                            }
                        ]
                    };

                    saveBootstrapCache(nextData);

                    return nextData;
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteEvent(calendarEventData) {
        try {
            const deletedEvent = await fetchDeleteTeacherCalendarEvent(calendarEventData);

            if (deletedEvent) {
                setData((currentData) => {
                    if (!currentData) return currentData;

                    const nextData = {
                        ...currentData,
                        calendarEvents: (currentData.calendarEvents ?? []).filter((calendarEvent) => {
                            return `${calendarEvent.id}` !== `${calendarEventData.calendarEventId}`;
                        })
                    };

                    saveBootstrapCache(nextData);

                    return nextData;
                });
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
                handleDeleteEvent={handleDeleteEvent}
            />
        </SectionLayout>
    );
}

export default CourseCalendarPage;
