import { findAllChatChannels, findAllChatMessages } from "./chat.repository.js";

export async function getChatChannelsService(userId) {
    return await findAllChatChannels(userId);
}

export async function getChatMessagesService(userId) {
    return await findAllChatMessages(userId);
}