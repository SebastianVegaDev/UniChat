import "./EmptyText.css";

function EmptyText({ children }) {
    return <p className="empty-text">{children}</p>;
}

export default EmptyText;