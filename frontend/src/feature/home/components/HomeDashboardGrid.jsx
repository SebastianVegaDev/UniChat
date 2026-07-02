import "./HomeDashboardGrid.css";
import HomeLatestNews from "./HomeLatestNews.jsx";
import HomeNextClassCard from "./HomeNextClassCard.jsx";
import HomeTodayClasses from "./HomeTodayClasses.jsx";

function HomeDashboardGrid({ todayClasses, nextClass, news }) {
    return (
        <div className="home-dashboard-grid">
            <HomeTodayClasses todayClasses={todayClasses} />
            <HomeNextClassCard nextClass={nextClass} />
            <HomeLatestNews news={news} />
        </div>
    );
}

export default HomeDashboardGrid;