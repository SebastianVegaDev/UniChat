import { useEffect } from "react";
import {
    addChatMessage,
    markChatChannelMessagesRead,
    markChatMessageDeleted,
    setPinnedChatMessage,
    updateChatChannelLock,
    updateChatMessageReactions
} from "../../bootstrap/updaters/bootstrap.updaters.js";
import {
    fetchDeleteMessage,
    fetchMarkChannelAsRead,
    fetchSendMessage,
    fetchSetFixedMessage,
    fetchToggleChatChannelLock,
    fetchToggleMessageReaction
} from "../api/courseChat.api.js";

export function useCourseChatActions({ data, currentUser, selectedChannelId, updateBootstrap }) {
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
            const fixedMessage = await fetchSetFixedMessage(messageData);

            if (fixedMessage) {
                updateBootstrap((currentData) => setPinnedChatMessage(currentData, messageData));
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleToggleChannelLock(channelData) {
        try {
            const lockedChannel = await fetchToggleChatChannelLock(channelData);

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
            const deletedMessage = await fetchDeleteMessage(messageData);

            if (deletedMessage) {
                updateBootstrap((currentData) => {
                    return markChatMessageDeleted(currentData, messageData.messageId, deletedMessage);
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleToggleReaction(reactionData) {
        try {
            const reactions = await fetchToggleMessageReaction(reactionData);

            if (reactions) {
                updateBootstrap((currentData) => {
                    return updateChatMessageReactions(
                        currentData,
                        reactionData.messageId,
                        reactions
                    );
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!selectedChannelId || !currentUser?.id) return;

        const messages = data?.chatMessages ?? [];

        const hasUnreadMessages = messages.some((message) => {
            const readBy = Array.isArray(message.readBy) ? message.readBy : [];
            const isSameChannel = `${message.channelId}` === `${selectedChannelId}`;
            const isMyMessage = `${message.senderId}` === `${currentUser?.id}`;
            const isReadByMe = readBy.some((userId) => `${userId}` === `${currentUser?.id}`);

            return isSameChannel
                && !isMyMessage
                && !isReadByMe
                && !message.isDeleted;
        });

        if (!hasUnreadMessages) return;

        let isCancelled = false;

        async function markChannelAsRead() {
            try {
                const result = await fetchMarkChannelAsRead({
                    channelId: selectedChannelId
                });

                if (isCancelled || !result?.readMessageIds?.length) return;

                updateBootstrap((currentData) => {
                    return markChatChannelMessagesRead(
                        currentData,
                        result.channelId,
                        currentUser.id,
                        result.readMessageIds
                    );
                });
            } catch (error) {
                console.log(error);
            }
        }

        markChannelAsRead();

        return () => {
            isCancelled = true;
        };
    }, [selectedChannelId, currentUser?.id, data?.chatMessages, updateBootstrap]);

    return {
        handleSubmit,
        handleToggleChannelLock,
        handleSetFixedMessage,
        handleDeleteMessage,
        handleToggleReaction
    };
}
