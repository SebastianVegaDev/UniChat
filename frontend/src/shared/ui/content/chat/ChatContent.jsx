import "./ChatContent.css";
import ChatMain from "./main/ChatMain.jsx";
import ChatSidebar from "./sidebar/ChatSidebar.jsx";

function ChatContent({course, channels, pinnedMessage, timeline, activeChannel}) {
    return (
        <div className="chat-content">
            <ChatSidebar 
                course={course}
                channels={channels}
            />
            <ChatMain 
                pinnedMessage={pinnedMessage}
                timeline={timeline}
                activeChannel={activeChannel}
            />
        </div>
    );
}

export default ChatContent;
