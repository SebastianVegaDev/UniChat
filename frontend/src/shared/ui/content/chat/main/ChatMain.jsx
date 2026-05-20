import "./ChatMain.css";
import { useEffect, useRef } from "react";
import ChatComposer from "./composer/ChatComposer.jsx";
import ChatHeader from "./header/ChatHeader.jsx";
import ChatMessages from "./messages/ChatMessages.jsx";

function ChatMain({ pinnedMessage, timeline, activeChannel, handleSubmit, currentUser }) {
    const messagesRef = useRef(null);
    const isChatLocked = activeChannel.isLocked;

    useEffect(() => {
        const messagesElement = messagesRef.current;

        if (!messagesElement) return;

        messagesElement.scrollTop = messagesElement.scrollHeight;
    }, [timeline, activeChannel.id]);

    return (
        <div className="chat-content-main">
            <ChatHeader 
                activeChannel={activeChannel} 
                isChatLocked={isChatLocked} 
                currentUser={currentUser}
            />
            <ChatMessages
                pinnedMessage={pinnedMessage}
                timeline={timeline}
                messagesRef={messagesRef}
                currentUser={currentUser}
            />
            <ChatComposer
                activeChannel={activeChannel}
                isChatLocked={isChatLocked}
                handleSubmit={handleSubmit}
                currentUser={currentUser}
            />
        </div>
    );
}

export default ChatMain;
