import "./NewsContent.css";
import NewsCard from "./cards/NewsCard.jsx";

function NewsContent({news}) {
    return (
        <div className="news-content">
            <NewsCard 
                news={news}
            />
        </div>
    );
}

export default NewsContent;