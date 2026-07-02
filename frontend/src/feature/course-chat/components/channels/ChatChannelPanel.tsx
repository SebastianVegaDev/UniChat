import "./ChatChannelPanel.css";
import { ChevronLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import AppButton from "../../../../shared/ui/primitives/button/AppButton.jsx";
import EmptyText from "../../../../shared/ui/primitives/empty/EmptyText.jsx";
import ChatChannelItem from "./ChatChannelItem.jsx";
import { filterChatChannels } from "../../helpers/chatChannels.js";

function ChatChannelPanel({ course, channels, activeChannelId, setActiveChannelId }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const { chat } = usePreferenceTexts();
    const filteredChannels = filterChatChannels(channels, searchTerm);

    return (
        <aside className="chat-channel-panel">
            <div className="chat-channel-course">
                <span>{course.shortName}</span>
                <div>
                    <p>{course.title}</p>
                    <small>{course.classroom}</small>
                </div>
            </div>

            <AppButton
                icon={ChevronLeft}
                variant="primary"
                onClick={() => navigate(course.route)}
            >
                {chat.backToCourse}
            </AppButton>

            <div className="chat-channel-search">
                <Search />
                <input
                    placeholder={chat.searchChat}
                    value={searchTerm}
                    autoComplete="off"
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>

            <div className="chat-channel-list">
                {filteredChannels.length === 0 && (
                    <EmptyText>{chat.noChatsFound}</EmptyText>
                )}

                {filteredChannels.map((channel) => (
                    <ChatChannelItem
                        key={channel.id}
                        channel={channel}
                        isActive={channel.id === activeChannelId}
                        onSelect={() => setActiveChannelId(channel.id)}
                    />
                ))}
            </div>
        </aside>
    );
}

export default ChatChannelPanel;