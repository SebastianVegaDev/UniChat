import "./HomeContent.css";
import HomeGrid from "./grid/HomeGrid.jsx";
import HomeQuickAccess from "./quick-access/HomeQuickAccess.jsx";

function HomeContent() {
    return (
        <div className="home-content">
            <div className="home-content-grid">
                <HomeGrid />
            </div>
            <div className="home-content-quick-access">
                <HomeQuickAccess />
            </div>
        </div>
    );
}

export default HomeContent;
