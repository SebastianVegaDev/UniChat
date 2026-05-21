import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import ChatContent from "../../../shared/ui/content/chat/ChatContent.jsx";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import {
    addChatMessage,
    markChatMessageDeleted,
    setPinnedChatMessage,
    updateChatChannelLock
} from "../../bootstrap/updaters/bootstrap.updaters.js";
import { mapCourseChatData } from "../mappers/courseChat.mapper.js";
import { fetchSendMessage } from "../api/courseChat.api.js";
import {
    fetchDeleteTeacherChatMessage,
    fetchSetTeacherFixedMessage,
    fetchToggleTeacherChatChannelLock
} from "../api/teacherChat.api.js";
import { useParams } from "react-router-dom";
import { useState } from "react";

function CourseChatPage() {
    const [activeChannelId, setActiveChannelId] = useState("");
    const { data, updateBootstrap, isLoading, error } = useBootstrap();
    const { courseSlug } = useParams();

    const courseChatData = mapCourseChatData(data, courseSlug, activeChannelId);
    const { currentUser, course, channels, pinnedMessage, timeline, activeChannel } = courseChatData;
    const selectedChannelId = channels.some((channel) => channel.id === activeChannelId) ? activeChannelId : activeChannel.channelId;

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    async function handleSubmit(messageData) {
        try {
            const message = await fetchSendMessage(messageData);

            if (message) {
                updateBootstrap((currentData) => addChatMessage(currentData, message));
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleSetFixedMessage(messageData) {
        try {
            const fixedMessage = await fetchSetTeacherFixedMessage(messageData);

            if (fixedMessage) {
                updateBootstrap((currentData) => setPinnedChatMessage(currentData, messageData));
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleToggleChannelLock(channelData) {
        try {
            const lockedChannel = await fetchToggleTeacherChatChannelLock(channelData);

            if (lockedChannel) {
                updateBootstrap((currentData) => {
                    return updateChatChannelLock(currentData, channelData.channelId, lockedChannel.isLocked);
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteMessage(messageData) {
        try {
            const deletedMessage = await fetchDeleteTeacherChatMessage(messageData);

            if (deletedMessage) {
                updateBootstrap((currentData) => {
                    return markChatMessageDeleted(currentData, messageData.messageId, deletedMessage);
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

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
            />
        </SectionLayout>
    );
}

export default CourseChatPage;
