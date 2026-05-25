import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import HomeContent from "../../../shared/ui/content/home/HomeContent.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import { mapHomeData } from "../../home/mappers/home.mapper.js";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import { Navigate } from "react-router-dom";

function HomePage() {
    const now = new Date();
    const { data, isLoading, error } = useBootstrap();
    const texts = usePreferenceTexts();

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    const homeData = mapHomeData(data, texts);
    const { currentUser, summary, todayClasses, nextClass, news, courses } = homeData;
    const isTeacher = currentUser.role === "teacher";

    if (currentUser.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    const date = now.toLocaleDateString(texts.locale, {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    return (
        <SectionLayout>
            <SectionHero
                eyebrow={`${texts.home.welcome} ${isTeacher ? texts.home.teacherShortName : ""} ${currentUser.name}!`}
                title={texts.home.title}
                description={`${date} · ${summary.pendingClasses} ${texts.home.pendingClasses} · ${summary.classesInProgress} ${texts.home.classInProgress}`}
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
