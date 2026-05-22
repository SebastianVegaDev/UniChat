import "./ChatContent.css";
import ChatMain from "./main/ChatMain.jsx";
import ChatSidebar from "./sidebar/ChatSidebar.jsx";

function ChatContent({course, channels, pinnedMessage, timeline, activeChannel, activeChannelId, setActiveChannelId, handleSubmit, handleToggleChannelLock, handleSetFixedMessage, handleDeleteMessage, currentUser}) {
    return (
        <div className="chat-content">
            <ChatSidebar 
                course={course}
                channels={channels}
                activeChannelId={activeChannelId}
                setActiveChannelId={setActiveChannelId}
            />
            <ChatMain
                handleSubmit={handleSubmit}
                pinnedMessage={pinnedMessage}
                timeline={timeline}
                activeChannel={activeChannel}
                currentUser={currentUser}
                handleToggleChannelLock={handleToggleChannelLock}
                handleSetFixedMessage={handleSetFixedMessage}
                handleDeleteMessage={handleDeleteMessage}
            />
        </div>
    );
}

export default ChatContent;
