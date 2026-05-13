import { getChatChannelsService, getChatMessagesService } from "./chat.service.js";

const userId = 1;

export async function getChatChannels(req, res, next) {
    try {
        const chatChannels = await getChatChannelsService(userId);

        res.json(chatChannels)
    } catch (error) {
        next(error);
    }
}

export async function getChatMessages(req, res, next) {
    try {
        const chatMessages = await getChatMessagesService(userId);

        res.json(chatMessages)
    } catch (error) {
        next(error);
    }
}