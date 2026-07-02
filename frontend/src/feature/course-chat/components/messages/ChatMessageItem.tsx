import "./ChatMessageItem.css";
import { CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEventHandler } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import StatusPill from "../../../../shared/ui/primitives/status/StatusPill.jsx";
import ChatAvatar from "./ChatAvatar.jsx";
import ChatMessageMenu from "./ChatMessageMenu.jsx";
import ChatMessageReactions from "./ChatMessageReactions.jsx";
import { getMessagePhotoUrl } from "../../helpers/chatAttachments.js";
import { getChatMessageBody, getChatMessageClassName, isMyChatMessage } from "../../helpers/chatMessages.js";

function ChatMessageItem({ message, currentUser, activeChannel, handleSetFixedMessage, handleDeleteMessage, handleToggleReaction }) {
    const [showOptions, setShowOptions] = useState(false);
    const messageRef = useRef<HTMLDivElement | null>(null);
    const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { chat } = usePreferenceTexts();
    const isMyMessage = isMyChatMessage(message);
    const isDeleted = message.isDeleted;
    const hasReactions = (message.reactions ?? []).length > 0;
    const author = isMyMessage ? chat.me : message.author;
    const body = getChatMessageBody({ message, chatTexts: chat });
    const photoUrl = getMessagePhotoUrl(message);
    const rowClassName = getChatMessageClassName(message);

    function clearPressTimer(): void {
        if (pressTimerRef.current) {
            clearTimeout(pressTimerRef.current);
            pressTimerRef.current = null;
        }
    }

    const startLongPress: PointerEventHandler<HTMLDivElement> = () => {
        clearPressTimer();

        pressTimerRef.current = setTimeout(() => {
            setShowOptions(true);
        }, 650);
    };

    function cancelLongPress(): void {
        clearPressTimer();
    }

    function toggleEmoji(emoji: string): void {
        handleToggleReaction({
            messageId: message.id,
            emoji
        });

        setShowOptions(false);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (messageRef.current && event.target instanceof Node && !messageRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            clearPressTimer();
        };
    }, []);

    const content = (
        <div
            className={`chat-message-bubble ${isDeleted ? "deleted" : ""} ${hasReactions ? "has-reactions" : ""}`}
            ref={messageRef}
            onPointerDown={isDeleted ? undefined : startLongPress}
            onPointerUp={isDeleted ? undefined : cancelLongPress}
            onPointerLeave={isDeleted ? undefined : cancelLongPress}
            onPointerCancel={isDeleted ? undefined : cancelLongPress}
        >
            {!isDeleted && (
                <div className="chat-message-header">
                    <h4>
                        {author}

                        {message.roleLabel && (
                            <StatusPill type={message.roleClass}>
                                {message.roleLabel}
                            </StatusPill>
                        )}
                    </h4>

                    <span>{message.timeLabel}</span>
                </div>
            )}

            {photoUrl && (
                <a
                    className="chat-message-photo"
                    href={photoUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    <img src={photoUrl} alt={message.attachmentName || chat.selectPhoto} />
                </a>
            )}

            {body && <p>{body}</p>}

            {!isDeleted && isMyMessage && (
                <CheckCheck className={`chat-message-checks ${message.wasRead ? "read" : ""}`} />
            )}

            {showOptions && !isDeleted && (
                <ChatMessageMenu
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
        <ChatAvatar
            avatarUrl={message.avatarUrl}
            initial={message.initial}
            author={author}
            variant={isMyMessage ? "me" : "other"}
        />
    );

    return (
        <div className={`chat-message-row ${rowClassName} ${isDeleted ? "message-deleted" : ""} ${hasReactions ? "has-reactions" : ""}`} data-message-id={message.id}>
            {isMyMessage ? content : avatar}
            {isMyMessage ? null : content}
            {isMyMessage ? avatar : null}
        </div>
    );
}

export default ChatMessageItem;
