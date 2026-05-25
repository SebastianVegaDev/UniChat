import "./ChatSidebar.css";
import { ChevronLeft, Search, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { usePreferenceTexts } from "../../../../../feature/preferences/context/PreferencesContext.js";

function ChatSidebar({ course, channels, activeChannelId, setActiveChannelId }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const { chat } = usePreferenceTexts();
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredChannels = normalizedSearchTerm
        ? channels.filter((channel) => {
            return (channel.title ?? "").toLowerCase().includes(normalizedSearchTerm)
                || (channel.description ?? "").toLowerCase().includes(normalizedSearchTerm);
        })
        : channels;

    return (
        <div className="chat-content-sidebar">
            <div className="chat-content-sidebar-course">
                <span>{course.shortName}</span>
                <div className="chat-content-sidebar-course-info">
                    <p>{course.title}</p>
                    <span>{course.classroom}</span>
                </div>
            </div>
            <button className="chat-content-sidebar-button" type="button" onClick={() => navigate(course.route)}>
                <ChevronLeft />
                {chat.backToCourse}
            </button>
            <div className="chat-content-sidebar-search-container">
                <Search className="chat-content-sidebar-search-icon" />
                <input
                    className="chat-content-sidebar-search"
                    placeholder={chat.searchChat}
                    value={searchTerm}
                    autoComplete="off"
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
            {filteredChannels.map((channel) => (
                <div
                    className={`chat-content-sidebar-chat ${channel.id === activeChannelId ? "selected" : ""}`}
                    key={channel.id}
                    onClick={() => setActiveChannelId(channel.id)}
                >
                    <span>
                        <MessageCircle />
                    </span>

                    <div className="chat-content-sidebar-chat-info">
                        <p>{channel.title}</p>
                        <span>{channel.description}</span>
                    </div>

                    {channel.unreadCount > 0 && (
                        <span className="chat-content-sidebar-chat-badge">
                            {channel.unreadCount}
                        </span>
                    )}
                </div>
            ))}
            {filteredChannels.length === 0 && (
                <p className="chat-content-sidebar-empty">{chat.noChatsFound}</p>
            )}
        </div>
    );
}

export default ChatSidebar;
