import { CalendarDays } from "lucide-react";
import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import CalendarContent from "../../../shared/ui/content/calendar/CalendarContent.jsx";
import { events, pendingItems } from "../db/calendar.db.json";

function CalendarPage() {
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

export default CalendarPage;
