import "./ChatContent.css";
import ChatChannelPanel from "./channels/ChatChannelPanel.jsx";
import ChatMain from "./main/ChatMain.jsx";

function ChatContent({ course, channels, pinnedMessage, timeline, activeChannel, activeChannelId, setActiveChannelId, handleSubmit, handleToggleChannelLock, handleSetFixedMessage, handleDeleteMessage, currentUser, handleToggleReaction }) {
    return (
        <div className="chat-content">
            <ChatChannelPanel
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
                handleToggleReaction={handleToggleReaction}
            />
        </div>
    );
}

export default ChatContent;