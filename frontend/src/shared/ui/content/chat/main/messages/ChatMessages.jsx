import "./ChatMessages.css";
import ChatMessage from "./message/ChatMessage.jsx";

function ChatMessages({ pinnedMessage, timeline, messagesRef, currentUser }) {
    return (
        <div className="chat-content-main-messages" ref={messagesRef}>
            {pinnedMessage && (
                <div className="chat-content-main-message-pinned">
                    <h4>Pinned message</h4>
                    <p>{pinnedMessage.body}</p>
                    <span>{pinnedMessage.author} · {pinnedMessage.timeLabel}</span>
                </div>
            )}
            {timeline.map((message) => {
                switch (message.type) {
                    case "date":
                    case "unread":
                        return (
                            <div className="chat-content-main-message-date" key={message.id}>
                                <p>{message.label}</p>
                            </div>
                        );
                    case "message-other":
                    case "message-me":
                        return <ChatMessage 
                            key={message.id} 
                            message={message}
                            currentUser={currentUser}
                        />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}

export default ChatMessages;
