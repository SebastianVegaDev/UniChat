import "./AiMessageList.css";
import AiMessageItem from "./AiMessageItem.jsx";
import AiTypingMessage from "./AiTypingMessage.jsx";

function AiMessageList({ messages, isLoading, messagesEndRef, speakingMessageId, speakMessage }) {
    return (
        <div className="ai-message-list">
            {messages.map((message) => (
                <AiMessageItem
                    key={message.id}
                    message={message}
                    speakingMessageId={speakingMessageId}
                    speakMessage={speakMessage}
                />
            ))}

            {isLoading && <AiTypingMessage />}

            <div ref={messagesEndRef} />
        </div>
    );
}

export default AiMessageList;