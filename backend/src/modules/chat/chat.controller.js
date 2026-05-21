import { deleteChatMessageService, getChatChannelsService, getChatMessagesService, sendChatMessageService } from "./chat.service.js";
import { validateDeleteChatMessage, validateSendChatMessage } from "../../validators/chat.validator.js";

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
        const data = validateSendChatMessage(req.body);

        const message = await sendChatMessageService({
            ...data,
            userId
        });

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
}

export async function deleteChatMessage(req, res, next) {
    try {
        const { messageId } = validateDeleteChatMessage(req.body);

        const userId = req.user.id;
        const deletedMessage = await deleteChatMessageService({messageId, userId});

        res.json(deletedMessage);
    } catch (error) {
        next(error);
    }
}
