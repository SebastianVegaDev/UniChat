import { deleteChatMessageService, getChatChannelsService, getChatMessagesService, markChatChannelAsReadService, sendChatMessageService, toggleChatMessageReactionService } from "./chat.service.js";
import { validateDeleteChatMessage, validateMarkChatChannelAsRead, validateSendChatMessage, validateToggleChatMessageReaction } from "../../validators/chat.validator.js";

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

export async function toggleChatMessageReaction(req, res, next) {
    try {
        const userId = req.user.id;
        const data = validateToggleChatMessageReaction(req.body);

        const reactions = await toggleChatMessageReactionService({
            ...data,
            userId
        });

        res.json(reactions)
    } catch (error) {
        next(error)
    }
}

export async function markChatChannelAsRead(req, res, next) {
    try {
        const userId = req.user.id;
        const data = validateMarkChatChannelAsRead(req.body);

        const result = await markChatChannelAsReadService({
            ...data,
            userId
        });

        res.json(result)
    } catch (error) {
        next(error);
    }
}