import "./NewsCard.css";

function NewsCard({ newsItem }) {
    return (
        <article className="news-card">
            <header className="news-card-header">
                <span>{newsItem.category}</span>
                <time>{newsItem.dateLabel}</time>
            </header>

            <div className="news-card-body">
                <h3>{newsItem.title}</h3>
                <p>{newsItem.body}</p>
            </div>

            <footer className="news-card-footer">
                <span>{newsItem.author}</span>
            </footer>
        </article>
    );
}

export default NewsCard;