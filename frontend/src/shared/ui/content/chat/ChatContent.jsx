import "./ChatContent.css";
import ChatMain from "./main/ChatMain.jsx";
import ChatSidebar from "./sidebar/ChatSidebar.jsx";

function ChatContent() {
    return (
        <div className="chat-content">
            <ChatSidebar />
            <ChatMain />
        </div>
    );
}

export default ChatContent;
