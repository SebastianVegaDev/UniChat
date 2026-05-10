import "./HomeContent.css";
import HomeGrid from "./grid/HomeGrid.jsx";
import HomeQuickAccess from "./quick-access/HomeQuickAccess.jsx";

function HomeContent(data) {
    const { todayClasses, nextClass, news, courses } = data;
    
    return (
        <div className="home-content">
            <div className="home-content-grid">
                <HomeGrid
                    todayClasses={todayClasses}
                    nextClass={nextClass}
                    news={news}
                />
            </div>
            <div className="home-content-quick-access">
                <HomeQuickAccess 
                    courses={courses}
                />
            </div>
        </div>
    );
}

export default HomeContent;
