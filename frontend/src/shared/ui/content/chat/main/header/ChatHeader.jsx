import "./ChatHeader.css";
import ChatHeaderOptions from "./options/ChatHeaderOptions.jsx";

function ChatHeader({ activeChannel, isChatLocked, currentUser }) {
    return (
        <div className="chat-content-main-header">
            <div>
                <h4>{activeChannel.name}</h4>
                <h3>{activeChannel.type}</h3>
            </div>
            <div className="chat-content-main-header-actions">
                {isChatLocked && (
                    <span className="chat-content-main-header-badge">Chat bloqueado</span>
                )}
                {currentUser.role === "teacher" ? <ChatHeaderOptions isChatLocked={isChatLocked} /> : null}
            </div>
        </div>
    );
}

export default ChatHeader;
