import { deleteChatMessageService, getChatChannelsService, getChatMessagesService, markChatChannelAsReadService, sendChatMessageService, toggleChatMessageReactionService } from "./chat.service.js";
import { validateDeleteChatMessage, validateMarkChatChannelAsRead, validateSendChatMessage, validateToggleChatMessageReaction } from "../../validators/chat.validator.js";
import { emitToChatChannel } from "../../socket/socket.js";
import { getChatPhotoData } from "./chat.helper.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";

export const getChatChannels = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const chatChannels = await getChatChannelsService(userId);

    res.json(chatChannels)
});

export const getChatMessages  = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const chatMessages = await getChatMessagesService(userId);

    res.json(chatMessages)
});

export const sendChatMessage  = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const attachmentData = getChatPhotoData(req.file);
    const data = validateSendChatMessage(req.body, {
        hasAttachment: Boolean(attachmentData.attachmentUrl)
    });

    const message = await sendChatMessageService({
        ...data,
        ...attachmentData,
        userId
    });

    emitToChatChannel(Number(message.channelId), "chat:message-created", message);

    res.status(201).json(message);
});

export const deleteChatMessage  = asyncHandler(async (req, res, next) => {
    const { messageId } = validateDeleteChatMessage(req.body);

    const userId = req.user.id;
    const deletedMessage = await deleteChatMessageService({messageId, userId});

    emitToChatChannel(Number(deletedMessage.channelId), "chat:message-deleted", {
        messageId: deletedMessage.id,
        deletedMessage
    });

    res.json(deletedMessage);
});

export const toggleChatMessageReaction  = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const data = validateToggleChatMessageReaction(req.body);

    const result = await toggleChatMessageReactionService({
        ...data,
        userId
    });

    emitToChatChannel(Number(result.channelId), "chat:message-reactions-updated", {
        messageId: result.messageId,
        userId,
        reactions: result.reactions
    });

    res.json(result.reactions);
});

export const markChatChannelAsRead  = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const data = validateMarkChatChannelAsRead(req.body);

    const result = await markChatChannelAsReadService({
        ...data,
        userId
    });
    emitToChatChannel(Number(result.channelId), "chat:messages-read", {
        ...result,
        userId
    });

    res.json(result)
});
