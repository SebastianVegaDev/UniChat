import "./ChatMain.css";
import { useEffect, useRef } from "react";
import ChatComposer from "../composer/ChatComposer.jsx";
import ChatHeader from "./ChatHeader.jsx";
import ChatMessagesList from "../messages/ChatMessagesList.jsx";
import ChatPinnedMessage from "./ChatPinnedMessage.jsx";

function ChatMain({ pinnedMessage, timeline, activeChannel, handleSubmit, handleToggleChannelLock, handleSetFixedMessage, handleDeleteMessage, currentUser, handleToggleReaction }) {
    const messagesRef = useRef(null);
    const isChatLocked = activeChannel.isLocked;

    function goToPinnedMessage() {
        if (!messagesRef.current || !pinnedMessage) return;

        const messageElement = messagesRef.current.querySelector(`[data-message-id="${pinnedMessage.id}"]`);

        messageElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    useEffect(() => {
        const messagesElement = messagesRef.current;

        if (!messagesElement) return;

        messagesElement.scrollTop = messagesElement.scrollHeight;
    }, [timeline, activeChannel.id]);

    return (
        <main className="chat-main">
            <ChatHeader
                activeChannel={activeChannel}
                isChatLocked={isChatLocked}
                currentUser={currentUser}
                handleToggleChannelLock={handleToggleChannelLock}
            />

            {pinnedMessage && (
                <ChatPinnedMessage
                    pinnedMessage={pinnedMessage}
                    goToPinnedMessage={goToPinnedMessage}
                />
            )}

            <ChatMessagesList
                timeline={timeline}
                messagesRef={messagesRef}
                currentUser={currentUser}
                activeChannel={activeChannel}
                handleSetFixedMessage={handleSetFixedMessage}
                handleDeleteMessage={handleDeleteMessage}
                handleToggleReaction={handleToggleReaction}
            />

            <ChatComposer
                activeChannel={activeChannel}
                isChatLocked={isChatLocked}
                handleSubmit={handleSubmit}
                currentUser={currentUser}
            />
        </main>
    );
}

export default ChatMain;