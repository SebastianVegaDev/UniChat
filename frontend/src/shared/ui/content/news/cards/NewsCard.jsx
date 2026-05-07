import "./NewsCard.css"

function NewsCard({news}) {
    return (
        <>
            {news.map((newsItem) => (
                <article className="news-card" key={newsItem.id}>
                    <div className="news-card-header">
                        <h3>{newsItem.category}</h3>
                        <h3>{newsItem.dateLabel}</h3>
                    </div>
                    <div className="news-card-body">
                        <h2>{newsItem.title}</h2>
                        <p>{newsItem.body}</p>
                    </div>
                    <div className="news-card-footer">
                        <h4>{newsItem.author}</h4>
                        <h4>{newsItem.readTimeLabel}</h4>
                    </div>
                </article>
            ))}

        </>
    );
}

export default NewsCard;