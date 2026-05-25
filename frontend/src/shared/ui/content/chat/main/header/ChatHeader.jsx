import "./ChatHeader.css";
import ChatHeaderOptions from "./options/ChatHeaderOptions.jsx";
import { usePreferenceTexts } from "../../../../../../feature/preferences/context/PreferencesContext.js";

function ChatHeader({ activeChannel, isChatLocked, currentUser, handleToggleChannelLock }) {
    const { chat } = usePreferenceTexts();

    return (
        <div className="chat-content-main-header">
            <div>
                <h4>{activeChannel.name}</h4>
                <h3>{activeChannel.type}</h3>
            </div>
            <div className="chat-content-main-header-actions">
                {isChatLocked && (
                    <span className="chat-content-main-header-badge">{chat.lockedBadge}</span>
                )}
                {currentUser.role === "teacher" ? (
                    <ChatHeaderOptions
                        activeChannel={activeChannel}
                        isChatLocked={isChatLocked}
                        handleToggleChannelLock={handleToggleChannelLock}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default ChatHeader;
