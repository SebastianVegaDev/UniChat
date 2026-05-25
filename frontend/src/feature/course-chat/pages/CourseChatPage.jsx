import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import ChatContent from "../../../shared/ui/content/chat/ChatContent.jsx";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import { mapCourseChatData } from "../mappers/courseChat.mapper.js";
import { useCourseChatActions } from "../hooks/courseChat.hooks.js";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import NotFoundPage from "../../not-found/pages/NotFoundPage.jsx";

function CourseChatPage() {
    const [activeChannelId, setActiveChannelId] = useState("");
    const { data, updateBootstrap, isLoading, error } = useBootstrap();
    const { courseSlug } = useParams();
    const { chat } = usePreferenceTexts();

    const courseChatData = mapCourseChatData(data, courseSlug, activeChannelId, chat);
    const {
        currentUser,
        course,
        channels = [],
        pinnedMessage,
        timeline = [],
        activeChannel = {}
    } = courseChatData;
    const selectedChannelId = channels.some((channel) => channel.id === activeChannelId) ? activeChannelId : activeChannel.channelId;
    const {
        handleSubmit,
        handleToggleChannelLock,
        handleSetFixedMessage,
        handleDeleteMessage,
        handleToggleReaction
    } = useCourseChatActions({
        data,
        currentUser,
        selectedChannelId,
        updateBootstrap
    });

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>
    if (courseChatData.notFound) return <NotFoundPage />;

    return (
        <SectionLayout>
            <ChatContent 
                course={course}
                channels={channels}
                pinnedMessage={pinnedMessage}
                timeline={timeline}
                activeChannel={activeChannel}
                activeChannelId={selectedChannelId}
                setActiveChannelId={setActiveChannelId}
                handleSubmit={handleSubmit}
                handleToggleChannelLock={handleToggleChannelLock}
                handleSetFixedMessage={handleSetFixedMessage}
                handleDeleteMessage={handleDeleteMessage}
                currentUser={currentUser}
                handleToggleReaction={handleToggleReaction}
            />
        </SectionLayout>
    );
}

export default CourseChatPage;
