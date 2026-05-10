import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import ChatContent from "../../../shared/ui/content/chat/ChatContent.jsx";
import { useBootstrapData } from "../../bootstrap/hooks/useBootstrapData.js";
import { mapCourseChatData } from "../mappers/courseChat.mapper.js";
import { useParams } from "react-router-dom";
import { useState } from "react";

function CourseChatPage() {
    const [activeChannelId, setActiveChannelId] = useState("");
    const { data, isLoading, error } = useBootstrapData();
    const { courseSlug } = useParams();

    const courseChatData = mapCourseChatData(data, courseSlug, activeChannelId);
    const { course, channels, pinnedMessage, timeline, activeChannel } = courseChatData;
    const selectedChannelId = channels.some((channel) => channel.id === activeChannelId) ? activeChannelId : activeChannel.channelId;

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

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
            />
        </SectionLayout>
    );
}

export default CourseChatPage;
