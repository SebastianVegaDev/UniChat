import {
    createChatMessage,
    findAllChatChannels,
    findAllChatMessages,
    softDeleteChatMessage,
    findChatMessageReaction,
    createChatMessageReaction,
    updateChatMessageReaction,
    deleteChatMessageReaction,
    findChatMessageReactions,
    markChannelMessagesAsRead
} from "./chat.repository.js";
import { ForbiddenError, NotFoundError } from "../../errors/index.js";
import {
    findUserChannelAccess,
    findChatMessageAccess
} from "../access/access.repository.js";

export async function getChatChannelsService(userId) {
    return await findAllChatChannels(userId);
}

export async function getChatMessagesService(userId) {
    return await findAllChatMessages(userId);
}

export async function sendChatMessageService(data) {
    const { channelId, userId, body, attachmentType, attachmentUrl, attachmentName } = data;

    const access = await findUserChannelAccess({
        userId,
        channelId
    })

    if (!access) {
        throw new NotFoundError("Chat channel not found");
    }

    if (access.isLocked && !access.isTeacher) {
        throw new ForbiddenError("Chat channel is locked");
    }

    const message = await createChatMessage({
        channelId,  
        userId, 
        body,
        attachmentType,
        attachmentUrl,
        attachmentName
    })

    return message;
}

export async function deleteChatMessageService({messageId, userId}) {
    const access = await findChatMessageAccess({
        userId,
        messageId
    });

    if (!access) {
        throw new NotFoundError("Chat message not found");
    }

    if (!access.isOwner && !access.isTeacher) {
        throw new ForbiddenError("Forbidden");
    }

    const message = await softDeleteChatMessage({messageId});

    if (!message) {
        throw new NotFoundError("Chat message not found");
    }

    return {
        ...message,
        channelId: access.channelId
    };
}

export async function toggleChatMessageReactionService({ messageId, userId, emoji }) {
    const access = await findChatMessageAccess({ userId, messageId });

    if (!access) {
        throw new NotFoundError("Chat message not found");
    }

    const reaction = await findChatMessageReaction({ messageId, userId });

    if (!reaction) {
        await createChatMessageReaction({ messageId, userId, emoji });
    } else if (reaction.emoji === emoji) {
        await deleteChatMessageReaction({ messageId, userId });
    } else {
        await updateChatMessageReaction({ messageId, userId, emoji });
    }

    const reactions = await findChatMessageReactions({ messageId, userId });

    return {
        messageId,
        channelId: access.channelId,
        reactions
    };
}

export async function markChatChannelAsReadService({ channelId, userId }) {
    const access = await findUserChannelAccess({
        userId,
        channelId
    });

    if (!access) {
        throw new NotFoundError("Chat channel not found");
    }

    const readMessages = await markChannelMessagesAsRead({
        channelId,
        userId
    });

    return {
        channelId,
        readMessageIds: readMessages.map((message) => message.messageId),
        readCount: readMessages.length
    }
}
