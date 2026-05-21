import { createChatMessage, findAllChatChannels, findAllChatMessages, softDeleteChatMessage } from "./chat.repository.js";
import { BadRequestError, NotFoundError } from "../../errors/index.js";

export async function getChatChannelsService(userId) {
    return await findAllChatChannels(userId);
}

export async function getChatMessagesService(userId) {
    return await findAllChatMessages(userId);
}

export async function sendChatMessageService(data) {
    const { channelId, userId, body } = data;

    if (!channelId) {
        throw new BadRequestError("Channel id is required");
    }

    if (!body?.trim()) {
        throw new BadRequestError("Message body is required");
    }

    const message = await createChatMessage({
        channelId,  
        userId, 
        body
    })

    if (!message) {
        throw new NotFoundError("Chat channel not found");
    }

    return message;
}

export async function deleteChatMessageService(messageId) {
    if (!messageId) {
        throw new BadRequestError("Message id is required");
    }

    const message = await softDeleteChatMessage({messageId});

    if (!message) {
        throw new NotFoundError("Chat message not found");
    }

    return message;
}
