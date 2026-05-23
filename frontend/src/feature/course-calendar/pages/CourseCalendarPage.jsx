import { CalendarDays } from "lucide-react";
import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import CalendarContent from "../../../shared/ui/content/calendar/CalendarContent.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import { mapCourseCalendarData } from "../mappers/courseCalendar.mapper.js";
import { useCourseCalendarActions } from "../hooks/courseCalendar.hooks.js";
import { useParams } from "react-router-dom";

function CourseCalendarPage() {
    const { data, updateBootstrap, isLoading, error } = useBootstrap();
    const { courseSlug } = useParams();
    const {
        handleCreateEvent,
        handleEditEvent,
        handleCancelEvent,
        handleDeleteEvent
    } = useCourseCalendarActions({ updateBootstrap });

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    const courseCalendarData = mapCourseCalendarData(data, courseSlug);
    const { course, currentUser, events, pendingItems } = courseCalendarData;
    
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
