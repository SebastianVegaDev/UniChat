import "./HomeGrid.css";
import HomeClasses from "./classes/HomeClasses.jsx";
import HomeNextClass from "./next-class/HomeNextClass.jsx";
import HomeNews from "./news/HomeNews.jsx";

function HomeGrid(data) {
    const { todayClasses, nextClass, news } = data;

    return (
        <div className="home-grid">
            <HomeClasses 
                todayClasses={todayClasses}
            />
            <HomeNextClass 
                nextClass={nextClass}
            />
            <HomeNews 
                news={news}
            />
        </div>
    );
}

export default HomeGrid;
