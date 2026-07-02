import "./HomeLatestNews.css";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import EmptyText from "../../../shared/ui/primitives/empty/EmptyText.jsx";
import HomeNewsPreview from "./HomeNewsPreview.jsx";

function HomeLatestNews({ news }) {
    const { home } = usePreferenceTexts();
    const latestNews = news.slice(0, 3);

    return (
        <section className="home-latest-news">
            <div className="home-section-header">
                <h3>{home.latestNews}</h3>
                <span>{latestNews.length}</span>
            </div>

            <div className="home-latest-news-list">
                {latestNews.length === 0 && (
                    <EmptyText>No hay noticias recientes.</EmptyText>
                )}

                {latestNews.map((newsItem) => (
                    <HomeNewsPreview key={newsItem.id} newsItem={newsItem} />
                ))}
            </div>
        </section>
    );
}

export default HomeLatestNews;