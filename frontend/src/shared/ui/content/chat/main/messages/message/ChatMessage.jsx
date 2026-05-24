import "./ChatMessage.css";
import { CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatMessageOptions from "./options/ChatMessageOptions.jsx";
import ChatMessageReactions from "./reactions/ChatMessageReactions.jsx";
import { usePreferenceTexts } from "../../../../../../../feature/preferences/context/PreferencesContext.js";

function ChatMessage({ message, currentUser, activeChannel, handleSetFixedMessage, handleDeleteMessage, handleToggleReaction }) {
    const [showOptions, setShowOptions] = useState(false);
    const messageRef = useRef(null);
    const pressTimerRef = useRef(null);
    const { chat } = usePreferenceTexts();
    const isMyMessage = message.type === "message-me";
    const isDeleted = message.isDeleted;
    const hasReactions = (message.reactions ?? []).length > 0;
    const author = isMyMessage ? chat.me : message.author;
    const body = isDeleted ? chat.deletedMessage : message.body;
    const messageClassName = isMyMessage
        ? "chat-content-main-message-me"
        : "chat-content-main-message-other";

    function startLongPress() {
        clearTimeout(pressTimerRef.current);

        pressTimerRef.current = setTimeout(() => {
            setShowOptions(true);
        }, 1000);
    }

    function cancelLongPress() {
        clearTimeout(pressTimerRef.current);
    }

    function toggleEmoji(emoji) {
        handleToggleReaction({
            messageId: message.id,
            emoji
        });

        setShowOptions(false);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (messageRef.current && !messageRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(pressTimerRef.current);
        };
    }, []);

    const content = (
        <div
            className={`chat-content-main-message ${isDeleted ? "deleted-message" : ""} ${hasReactions ? "has-reactions" : ""}`}
            ref={messageRef}
            onPointerDown={isDeleted ? undefined : startLongPress}
            onPointerUp={isDeleted ? undefined : cancelLongPress}
            onPointerLeave={isDeleted ? undefined : cancelLongPress}
            onPointerCancel={isDeleted ? undefined : cancelLongPress}
        >
            {!isDeleted && (
                <div className="chat-content-main-message-header">
                    <h4>
                        {author}
                        {message.roleLabel && (
                            <span className={`chat-content-main-message-role ${message.roleClass}`}>
                                {message.roleLabel}
                            </span>
                        )}
                    </h4>
                    <span>{message.timeLabel}</span>
                </div>
            )}
            <p>{body}</p>
            {!isDeleted && isMyMessage && (
                <CheckCheck className={`chat-content-main-message-checks ${message.wasRead ? "read" : ""}`} />
            )}
            {showOptions && !isDeleted && (
                <ChatMessageOptions
                    body={message.body}
                    messageId={message.id}
                    channelId={activeChannel.channelId}
                    isMyMessage={isMyMessage}
                    closeOptions={() => setShowOptions(false)}
                    currentUser={currentUser}
                    handleSetFixedMessage={handleSetFixedMessage}
                    handleDeleteMessage={handleDeleteMessage}
                />
            )}
            {!isDeleted && (
                <ChatMessageReactions
                    showReactions={showOptions}
                    reactions={message.reactions ?? []}
                    handleToggleEmoji={toggleEmoji}
                />
            )}
        </div>
    );

    const avatar = (
        <MessageAvatar
            avatarUrl={message.avatarUrl}
            initial={message.initial}
            author={author}
        />
    );

    return (
        <div className={`${messageClassName} ${isDeleted ? "message-deleted" : ""} ${hasReactions ? "has-reactions" : ""}`} data-message-id={message.id}>
            {isMyMessage ? content : avatar}
            {isMyMessage ? null : content}
            {isMyMessage ? avatar : null}
        </div>
    );
}

export default ChatMessage;

function MessageAvatar({ avatarUrl, initial, author }) {
    if (avatarUrl) {
        return (
            <img
                className="chat-content-main-message-avatar"
                src={avatarUrl}
                alt={author}
            />
        );
    }

    return <span className="chat-content-main-message-avatar">{initial}</span>;
}
