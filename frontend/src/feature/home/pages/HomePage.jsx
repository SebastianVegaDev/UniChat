import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import HomeContent from "../../../shared/ui/content/home/HomeContent.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { mapHomeData } from "../../home/mappers/home.mapper.js";
import { useBootstrapData } from "../../bootstrap/hooks/useBootstrapData.js";

function HomePage() {
    const now = new Date();
    const { data, isLoading, error } = useBootstrapData();

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    const homeData = mapHomeData(data);
    const { student, summary, todayClasses, nextClass, news, courses } = homeData;

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
                description={`${date} · ${summary.pendingClasses} pending classes · ${summary.classesInProgress} class in progress`}
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
