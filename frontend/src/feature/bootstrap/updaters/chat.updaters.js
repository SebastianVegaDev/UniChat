import {
    findCourseIdByChannel,
    getNow,
    isSameId,
    updateCourseStats
} from "./bootstrapUpdater.utils.js";

export function addChatMessage(data, message) {
    const messageAlreadyExists = (data.chatMessages ?? []).some((chatMessage) => {
        return isSameId(chatMessage.id, message.id);
    });

    if (messageAlreadyExists) return data;

    const nextData = {
        ...data,
        chatMessages: [
            ...(data.chatMessages ?? []),
            message
        ]
    };

    const courseId = findCourseIdByChannel(nextData, message.channelId);

    return updateCourseStats(nextData, courseId, (stat) => ({
        ...stat,
        lastActivityAt: message.createdAt ?? getNow()
    }));
}

export function setPinnedChatMessage(data, messageData) {
    return {
        ...data,
        chatMessages: (data.chatMessages ?? []).map((message) => ({
            ...message,
            isPinned: isSameId(message.channelId, messageData.channelId)
                ? isSameId(message.id, messageData.messageId)
                : message.isPinned
        }))
    };
}

export function updateChatChannelLock(data, channelId, isLocked) {
    return {
        ...data,
        chatChannels: (data.chatChannels ?? []).map((channel) => {
            if (!isSameId(channel.id, channelId)) return channel;

            return {
                ...channel,
                isLocked
            };
        })
    };
}

export function markChatMessageDeleted(data, messageId, deletedMessage) {
    const messageToDelete = (data.chatMessages ?? []).find((message) => {
        return isSameId(message.id, messageId);
    });

    const nextData = {
        ...data,
        chatMessages: (data.chatMessages ?? []).map((message) => {
            if (!isSameId(message.id, messageId)) return message;

            return {
                ...message,
                body: deletedMessage.body,
                isPinned: false,
                isDeleted: true
            };
        })
    };

    const courseId = findCourseIdByChannel(nextData, messageToDelete?.channelId);

    return updateCourseStats(nextData, courseId, (stat) => ({
        ...stat,
        lastActivityAt: getNow()
    }));
}

export function updateChatMessageReactions(data, messageId, reactions) {
    return {
        ...data,
        chatMessages: (data.chatMessages ?? []).map((message) => {
            if (!isSameId(message.id, messageId)) return message;

            return {
                ...message,
                reactions
            };
        })
    };
}

export function markChatChannelMessagesRead(data, channelId, userId, readMessagesIds = []) {
    const readMessageIdsSet = new Set(readMessagesIds.map((id)  => `${id}`));

    if (readMessageIdsSet.size === 0) return data;

    const nextData = {
        ...data,
        chatMessages: (data.chatMessages ?? []).map((message) => {
            if (!isSameId(message.channelId, channelId)) return message;
            if (!readMessageIdsSet.has(`${message.id}`)) return message;

            const readBy = Array.isArray(message.readBy) ? message.readBy: [];
            const alreadyReadByUser = readBy.some((readUserId) => {
                return isSameId(readUserId, userId);
            });

            if (alreadyReadByUser) return message;

            return {
                ...message,
                readBy: [
                    ...readBy,
                    userId
                ]
            };
        })
    };

    const courseId = findCourseIdByChannel(nextData, channelId);

    return updateCourseStats(nextData, courseId, (stat) => ({
        ...stat,
        unreadMessagesCount: Math.max(
            (stat.unreadMessagesCount ?? 0) - readMessageIdsSet.size,
            0
        )
    }));
}
