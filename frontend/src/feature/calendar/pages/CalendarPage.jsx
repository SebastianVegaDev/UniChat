import { CalendarDays } from "lucide-react";
import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import CalendarContent from "../../../shared/ui/content/calendar/CalendarContent.jsx";

function CalendarPage() {
    return (
        <SectionLayout>
            <SectionHero
                eyebrow={<><CalendarDays /> Calendar</>}
                title={"Calendar"}
                description={"Upcoming classes, assignments, and academic events."}
            />
            <CalendarContent />
        </SectionLayout>
    );
}

export default CalendarPage;
