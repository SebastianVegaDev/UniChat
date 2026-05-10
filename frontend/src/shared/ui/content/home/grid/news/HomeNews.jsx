import "./HomeNews.css";

function HomeNews({ news = [] }) {
    return (
        <div className="home-grid-news">
            <p>Latest news</p>
            <div className="home-grid-news-list">
                {news.map((newsItem) => (
                    <article className="home-grid-new" key={newsItem.id}>
                        <h3>{newsItem.title}</h3>
                        <h4>{newsItem.description}</h4>
                        <p>{newsItem.dateLabel}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default HomeNews;
