import "./HomeNews.css";
import { usePreferenceTexts } from "../../../../../../feature/preferences/context/PreferencesContext.js";

function HomeNews({ news = [] }) {
    const { home } = usePreferenceTexts();

    return (
        <div className="home-grid-news">
            <p>{home.latestNews}</p>
            <div className="home-grid-news-list">
                {news.map((newsItem) => (
                    <div className="home-grid-new" key={newsItem.id}>
                        <h3>{newsItem.title}</h3>
                        <h4>{newsItem.description}</h4>
                        <p>{newsItem.dateLabel}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomeNews;
