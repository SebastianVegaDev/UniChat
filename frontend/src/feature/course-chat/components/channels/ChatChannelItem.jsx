import "./ChatChannelItem.css";
import { MessageCircle } from "lucide-react";
import StatusPill from "../../../../shared/ui/primitives/status/StatusPill.jsx";

function ChatChannelItem({ channel, isActive, onSelect }) {
    return (
        <button
            className={`chat-channel-item ${isActive ? "active" : ""}`}
            type="button"
            onClick={onSelect}
        >
            <span className="chat-channel-item-icon">
                <MessageCircle />
            </span>

            <div className="chat-channel-item-info">
                <p>{channel.title}</p>
                <span>{channel.description}</span>
            </div>

            {channel.unreadCount > 0 && (
                <StatusPill type="danger">
                    {channel.unreadCount}
                </StatusPill>
            )}
        </button>
    );
}

export default ChatChannelItem;