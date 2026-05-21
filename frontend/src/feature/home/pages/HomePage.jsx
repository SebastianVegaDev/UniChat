import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import HomeContent from "../../../shared/ui/content/home/HomeContent.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { mapHomeData } from "../../home/mappers/home.mapper.js";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";

function HomePage() {
    const now = new Date();
    const { data, isLoading, error } = useBootstrap();

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    const homeData = mapHomeData(data);
    const { currentUser, summary, todayClasses, nextClass, news, courses } = homeData;
    const isTeacher = currentUser.role === "teacher";

    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    return (
        <SectionLayout>
            <SectionHero
                eyebrow={`Welcome ${isTeacher ? "Proff": ""} ${currentUser.name}!`}
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
