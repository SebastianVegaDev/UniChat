import "./ChatMessagesList.css";
import EmptyText from "../../../../shared/ui/primitives/empty/EmptyText.jsx";
import ChatMessageItem from "./ChatMessageItem.jsx";
import ChatTimelineSeparator from "./ChatTimelineSeparator.jsx";

function ChatMessagesList({ timeline, messagesRef, currentUser, activeChannel, handleSetFixedMessage, handleDeleteMessage, handleToggleReaction }) {
    return (
        <div className="chat-messages-list" ref={messagesRef}>
            {timeline.length === 0 && (
                <EmptyText>No hay mensajes todavía.</EmptyText>
            )}

            {timeline.map((message) => {
                switch (message.type) {
                    case "date":
                    case "unread":
                        return (
                            <ChatTimelineSeparator
                                key={message.id}
                                label={message.label}
                                type={message.type}
                            />
                        );

                    case "message-other":
                    case "message-me":
                        return (
                            <ChatMessageItem
                                key={message.id}
                                message={message}
                                currentUser={currentUser}
                                activeChannel={activeChannel}
                                handleSetFixedMessage={handleSetFixedMessage}
                                handleDeleteMessage={handleDeleteMessage}
                                handleToggleReaction={handleToggleReaction}
                            />
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}

export default ChatMessagesList;