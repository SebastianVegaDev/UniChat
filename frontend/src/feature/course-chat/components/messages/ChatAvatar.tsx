import "./ChatAvatar.css";

function ChatAvatar({ avatarUrl, initial, author, variant = "other" }) {
    if (avatarUrl) {
        return (
            <img
                className="chat-avatar"
                src={avatarUrl}
                alt={author}
            />
        );
    }

    return <span className={`chat-avatar chat-avatar-${variant}`}>{initial}</span>;
}

export default ChatAvatar;