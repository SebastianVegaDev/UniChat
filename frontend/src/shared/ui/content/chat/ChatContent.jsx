import "./ChatContent.css";
import ChatMain from "./main/ChatMain.jsx";
import ChatSidebar from "./sidebar/ChatSidebar.jsx";

function ChatContent({course, channels, pinnedMessage, timeline, activeChannel, activeChannelId, setActiveChannelId, handleSubmit}) {
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
            />
        </div>
    );
}

export default ChatContent;
