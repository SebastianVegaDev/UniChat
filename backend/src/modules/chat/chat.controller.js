import { getChatChannelsService, getChatMessagesService, sendChatMessageService } from "./chat.service.js";

export async function getChatChannels(req, res, next) {
    try {
        const userId = req.user.id;

        const chatChannels = await getChatChannelsService(userId);

        res.json(chatChannels)
    } catch (error) {
        next(error);
    }
}

export async function getChatMessages(req, res, next) {
    try {
        const userId = req.user.id;

        const chatMessages = await getChatMessagesService(userId);

        res.json(chatMessages)
    } catch (error) {
        next(error);
    }
}

export async function sendChatMessage(req, res, next) {
    try {
        const userId = req.user.id;
        const channelId = req.body.channelId;
        const body = req.body.body;

        const message = await sendChatMessageService({
            channelId,
            userId,
            body
        });

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
}
