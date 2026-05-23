import "./ChatMessageReactions.css";

const MESSAGE_EMOJIS = ["👍", "😂", "❤️", "🔥", "😮", "😢", "🙏"];

function ChatMessageReactions({ showReactions, reactions, handleToggleEmoji }) {
    return (
        <>
            {showReactions && (
                <div className="chat-content-main-message-emojis">
                    {MESSAGE_EMOJIS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => handleToggleEmoji(emoji)}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {reactions.length > 0 && (
                <div className="chat-content-main-message-reactions">
                    {reactions.map((reaction) => (
                        <button
                            key={reaction.emoji}
                            type="button"
                            className={reaction.reactedByMe ? "selected" : ""}
                            onClick={() => handleToggleEmoji(reaction.emoji)}
                        >
                            {reaction.emoji}
                            <span>{reaction.count}</span>
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}

export default ChatMessageReactions;
