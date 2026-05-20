import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import ChatContent from "../../../shared/ui/content/chat/ChatContent.jsx";
import { useBootstrapData } from "../../bootstrap/hooks/useBootstrapData.js";
import { saveBootstrapCache } from "../../bootstrap/cache/bootstrap.cache.js";
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
    const { data, setData, isLoading, error } = useBootstrapData();
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
                setData((currentData) => {
                    if (!currentData) return currentData;

                    const nextData = {
                        ...currentData,
                        chatMessages: [
                            ...(currentData.chatMessages ?? []),
                            message
                        ]
                    };

                    saveBootstrapCache(nextData);

                    return nextData;
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleSetFixedMessage(messageData) {
        try {
            const fixedMessage = await fetchSetTeacherFixedMessage(messageData);

            if (fixedMessage) {
                setData((currentData) => {
                    if (!currentData) return currentData;

                    const nextData = {
                        ...currentData,
                        chatMessages: (currentData.chatMessages ?? []).map((message) => ({
                            ...message,
                            isPinned: `${message.channelId}` === `${messageData.channelId}`
                                ? `${message.id}` === `${messageData.messageId}`
                                : message.isPinned
                        }))
                    };

                    saveBootstrapCache(nextData);

                    return nextData;
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleToggleChannelLock(channelData) {
        try {
            const lockedChannel = await fetchToggleTeacherChatChannelLock(channelData);

            if (lockedChannel) {
                setData((currentData) => {
                    if (!currentData) return currentData;

                    const nextData = {
                        ...currentData,
                        chatChannels: (currentData.chatChannels ?? []).map((channel) => {
                            if (`${channel.id}` !== `${channelData.channelId}`) return channel;

                            return {
                                ...channel,
                                isLocked: lockedChannel.isLocked
                            };
                        })
                    };

                    saveBootstrapCache(nextData);

                    return nextData;
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
                setData((currentData) => {
                    if (!currentData) return currentData;

                    const nextData = {
                        ...currentData,
                        chatMessages: (currentData.chatMessages ?? []).map((message) => {
                            if (`${message.id}` !== `${messageData.messageId}`) return message;

                            return {
                                ...message,
                                body: deletedMessage.body,
                                isPinned: false,
                                isDeleted: true
                            };
                        })
                    };

                    saveBootstrapCache(nextData);

                    return nextData;
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
