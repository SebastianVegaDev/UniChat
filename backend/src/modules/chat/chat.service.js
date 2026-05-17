import { findAllChatChannels, findAllChatMessages, createChatMessage } from "./chat.repository.js";

export async function getChatChannelsService(userId) {
    return await findAllChatChannels(userId);
}

export async function getChatMessagesService(userId) {
    return await findAllChatMessages(userId);
}

export async function sendChatMessageService(data) {
    const { channelId, userId, body, isPinned } = data;

    return await createChatMessage({
        channelId,  
        userId, 
        body
    })
}