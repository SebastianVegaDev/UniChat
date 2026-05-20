import "./ChatMessage.css";
import { CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatMessageOptions from "./options/ChatMessageOptions.jsx";

function ChatMessage({ message, currentUser }) {
    const [showOptions, setShowOptions] = useState(false);
    const messageRef = useRef(null);
    const pressTimerRef = useRef(null);
    const isMyMessage = message.type === "message-me";
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
            className="chat-content-main-message"
            ref={messageRef}
            onPointerDown={startLongPress}
            onPointerUp={cancelLongPress}
            onPointerLeave={cancelLongPress}
            onPointerCancel={cancelLongPress}
        >
            <div className="chat-content-main-message-header">
                <h4>
                    {message.author}
                    {message.roleLabel && (
                        <span className={`chat-content-main-message-role ${message.roleClass}`}>
                            {message.roleLabel}
                        </span>
                    )}
                </h4>
                <span>{message.timeLabel}</span>
            </div>
            <p>{message.body}</p>
            <CheckCheck className={`chat-content-main-message-checks ${message.wasRead ? "read" : ""}`} />
            {showOptions && (
                <ChatMessageOptions
                    body={message.body}
                    isMyMessage={isMyMessage}
                    closeOptions={() => setShowOptions(false)}
                    currentUser={currentUser}
                />
            )}
        </div>
    );

    const avatar = (
        <MessageAvatar
            avatarUrl={message.avatarUrl}
            initial={message.initial}
            author={message.author}
        />
    );

    return (
        <div className={messageClassName}>
            {isMyMessage ? content : avatar}
            {isMyMessage ? avatar : content}
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
