import "./HomeContent.css";
import HomeDashboardGrid from "./HomeDashboardGrid.jsx";
import HomeQuickAccess from "./HomeQuickAccess.jsx";

function HomeContent({ todayClasses, nextClass, news, courses }) {
    return (
        <div className="home-content">
            <HomeDashboardGrid
                todayClasses={todayClasses}
                nextClass={nextClass}
                news={news}
            />

            <HomeQuickAccess courses={courses} />
        </div>
    );
}

export default HomeContent;