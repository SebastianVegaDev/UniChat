import {
    findCourseIdByChannel,
    getNow,
    isSameId,
    updateCourseStats
} from "./bootstrapUpdater.utils.js";

function isUnreadForUser(message, userId) {
    if (!message || message.isDeleted) return false;
    if (isSameId(message.senderId, userId)) return false;

    const readBy = Array.isArray(message.readBy) ? message.readBy : [];

    return !readBy.some((readUserId) => isSameId(readUserId, userId));
}

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
    const currentUserId = data.session?.currentUserId;
    const shouldCountAsUnread = isUnreadForUser(message, currentUserId);

    return updateCourseStats(nextData, courseId, (stat) => ({
        ...stat,
        unreadMessagesCount: shouldCountAsUnread
            ? (stat.unreadMessagesCount ?? 0) + 1
            : (stat.unreadMessagesCount ?? 0),
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
    const currentUserId = data.session?.currentUserId;
    const shouldDecreaseUnreadCount = isUnreadForUser(messageToDelete, currentUserId);

    const nextData = {
        ...data,
        chatMessages: (data.chatMessages ?? []).map((message) => {
            if (!isSameId(message.id, messageId)) return message;

            return {
                ...message,
                body: deletedMessage.body,
                attachmentType: deletedMessage.attachmentType ?? "",
                attachmentUrl: deletedMessage.attachmentUrl ?? "",
                attachmentName: deletedMessage.attachmentName ?? "",
                isPinned: false,
                isDeleted: true
            };
        })
    };

    const courseId = findCourseIdByChannel(nextData, messageToDelete?.channelId);

    return updateCourseStats(nextData, courseId, (stat) => ({
        ...stat,
        unreadMessagesCount: shouldDecreaseUnreadCount
            ? Math.max((stat.unreadMessagesCount ?? 0) - 1, 0)
            : (stat.unreadMessagesCount ?? 0),
        lastActivityAt: getNow()
    }));
}

export function updateChatMessageReactions(data, messageId, reactions, actorUserId) {
    const currentUserId = data.session?.currentUserId;

    return {
        ...data,
        chatMessages: (data.chatMessages ?? []).map((message) => {
            if (!isSameId(message.id, messageId)) return message;

            const currentReactions = message.reactions ?? [];
            const shouldUsePayloadAsMine = !actorUserId || isSameId(actorUserId, currentUserId);

            return {
                ...message,
                reactions: shouldUsePayloadAsMine
                    ? reactions
                    : reactions.map((reaction) => ({
                        ...reaction,
                        reactedByMe: currentReactions.some((currentReaction) => {
                            return currentReaction.emoji === reaction.emoji
                                && currentReaction.reactedByMe;
                        })
                    }))
            };
        })
    };
}

export function markChatChannelMessagesRead(data, channelId, userId, readMessagesIds: Array<string | number> = []) {
    const readMessageIdsSet = new Set(readMessagesIds.map((id) => `${id}`));

    if (readMessageIdsSet.size === 0) return data;

    let addedReadCount = 0;

    const nextData = {
        ...data,
        chatMessages: (data.chatMessages ?? []).map((message) => {
            if (!isSameId(message.channelId, channelId)) return message;
            if (!readMessageIdsSet.has(`${message.id}`)) return message;

            const readBy = Array.isArray(message.readBy) ? message.readBy : [];
            const alreadyReadByUser = readBy.some((readUserId) => {
                return isSameId(readUserId, userId);
            });

            if (alreadyReadByUser) return message;

            addedReadCount += 1;

            return {
                ...message,
                readBy: [...readBy, userId]
            };
        })
    };

    const courseId = findCourseIdByChannel(nextData, channelId);
    const shouldUpdateUnreadCount = isSameId(userId, data.session?.currentUserId);

    return updateCourseStats(nextData, courseId, (stat) => ({
        ...stat,
        unreadMessagesCount: shouldUpdateUnreadCount
            ? Math.max((stat.unreadMessagesCount ?? 0) - addedReadCount, 0)
            : (stat.unreadMessagesCount ?? 0)
    }));
}
