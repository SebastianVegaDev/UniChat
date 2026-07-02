import "./ChatTimelineSeparator.css";

function ChatTimelineSeparator({ label, type = "date" }) {
    return (
        <div className={`chat-timeline-separator chat-timeline-separator-${type}`}>
            <p>{label}</p>
        </div>
    );
}

export default ChatTimelineSeparator;