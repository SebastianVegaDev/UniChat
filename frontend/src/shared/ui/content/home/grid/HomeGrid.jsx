import "./HomeGrid.css";
import HomeClasses from "./classes/HomeClasses.jsx";
import HomeNextClass from "./next-class/HomeNextClass.jsx";
import HomeNews from "./news/HomeNews.jsx";

function HomeGrid() {
    return (
        <div className="home-grid">
            <HomeClasses />
            <HomeNextClass />
            <HomeNews />
        </div>
    );
}

export default HomeGrid;
