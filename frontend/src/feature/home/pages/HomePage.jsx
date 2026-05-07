import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import HomeContent from "../../../shared/ui/content/home/HomeContent.jsx";
import { student, summary, todayClasses, nextClass, news, courses } from "../db/home.db.json";


function HomePage() {
    const now = new Date();

    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    return (
        <SectionLayout>
            <SectionHero
                eyebrow={`Welcome ${student.name}!`}
                title="My Day"
                description={`${date} · ${summary.pendingClasses} pending courses · ${summary.classesInProgress} class in progress`}
            />
            <HomeContent 
                todayClasses={todayClasses}
                nextClass={nextClass}
                news={news}
                courses={courses}
            />
        </SectionLayout>
    );
}

export default HomePage;
