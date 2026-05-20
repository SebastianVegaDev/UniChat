import "./ChatMessages.css";
import ChatMessage from "./message/ChatMessage.jsx";

function ChatMessages({ timeline, messagesRef, currentUser, activeChannel, handleSetFixedMessage, handleDeleteMessage }) {
    return (
        <div className="chat-content-main-messages" ref={messagesRef}>
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
                            activeChannel={activeChannel}
                            handleSetFixedMessage={handleSetFixedMessage}
                            handleDeleteMessage={handleDeleteMessage}
                        />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}

export default ChatMessages;
