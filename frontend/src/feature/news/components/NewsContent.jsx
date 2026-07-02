import "./NewsContent.css";
import EmptyText from "../../../shared/ui/primitives/empty/EmptyText.jsx";
import NewsCard from "./NewsCard.jsx";

function NewsContent({ news }) {
    if (!news.length) {
        return (
            <div className="news-content">
                <EmptyText>No hay noticias disponibles.</EmptyText>
            </div>
        );
    }

    return (
        <div className="news-content">
            {news.map((newsItem) => (
                <NewsCard key={newsItem.id} newsItem={newsItem} />
            ))}
        </div>
    );
}

export default NewsContent;