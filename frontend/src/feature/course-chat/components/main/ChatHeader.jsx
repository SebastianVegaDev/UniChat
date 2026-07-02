import "./ChatHeader.css";
import { Lock } from "lucide-react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import StatusPill from "../../../../shared/ui/primitives/status/StatusPill.jsx";
import ChatHeaderMenu from "./ChatHeaderMenu.jsx";

function ChatHeader({ activeChannel, isChatLocked, currentUser, handleToggleChannelLock }) {
    const { chat } = usePreferenceTexts();

    return (
        <header className="chat-header">
            <div>
                <p>{activeChannel.type}</p>
                <h3>{activeChannel.name}</h3>
            </div>

            <div className="chat-header-actions">
                {isChatLocked && (
                    <StatusPill type="danger">
                        <Lock />
                        {chat.lockedBadge}
                    </StatusPill>
                )}

                {currentUser.role === "teacher" && (
                    <ChatHeaderMenu
                        activeChannel={activeChannel}
                        isChatLocked={isChatLocked}
                        handleToggleChannelLock={handleToggleChannelLock}
                    />
                )}
            </div>
        </header>
    );
}

export default ChatHeader;