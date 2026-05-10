import { CalendarDays } from "lucide-react";
import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import CalendarContent from "../../../shared/ui/content/calendar/CalendarContent.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { useBootstrapData } from "../../bootstrap/hooks/useBootstrapData.js";
import { mapCourseCalendarData } from "../mappers/courseCalendar.mapper.js";
import { useParams } from "react-router-dom";

function CourseCalendarPage() {
    const { data, isLoading, error } = useBootstrapData();
    const { courseSlug } = useParams();

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    const courseCalendarData = mapCourseCalendarData(data, courseSlug);
    const { events, pendingItems } = courseCalendarData;
    
    return (
        <SectionLayout>
            <SectionHero
                eyebrow={<><CalendarDays /> Calendar</>}
                title={"Calendar"}
                description={"Upcoming classes, assignments, and academic events."}
            />
            <CalendarContent 
                events={events}
                pendingItems={pendingItems}
            />
        </SectionLayout>
    );
}

export default CourseCalendarPage;
