import { createChatMessage, findAllChatChannels, findAllChatMessages, softDeleteChatMessage } from "./chat.repository.js";
import { ForbiddenError, NotFoundError } from "../../errors/index.js";
import { findUserChannelAccess, findChatMessageAccess } from "../access/access.repository.js";

export async function getChatChannelsService(userId) {
    return await findAllChatChannels(userId);
}

export async function getChatMessagesService(userId) {
    return await findAllChatMessages(userId);
}

export async function sendChatMessageService(data) {
    const { channelId, userId, body } = data;

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
        body
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

    return message;
}
