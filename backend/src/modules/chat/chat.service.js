import { findAllChatChannels, findAllChatMessages, createChatMessage } from "./chat.repository.js";
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
