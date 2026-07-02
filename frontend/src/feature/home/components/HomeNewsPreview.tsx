import "./HomeNewsPreview.css";

function HomeNewsPreview({ newsItem }) {
    return (
        <article className="home-news-preview">
            <h4>{newsItem.title}</h4>
            <p>{newsItem.description}</p>
            <span>{newsItem.dateLabel}</span>
        </article>
    );
}

export default HomeNewsPreview;