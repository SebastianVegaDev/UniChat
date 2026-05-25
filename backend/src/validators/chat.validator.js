import {
    validateEnum,
    validateOptionalString,
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";
import { BadRequestError } from "../errors/index.js";

const CHAT_REACTION_EMOJIS = ["👍", "😂", "❤️", "🔥", "😮", "😢", "🙏"];

export function validateSendChatMessage(body = {}, options = {}) {
    const hasAttachment = Boolean(options.hasAttachment);
    const messageBody = hasAttachment
        ? validateOptionalString(body.body, "Message body", 2000)
        : validateRequiredString(body.body, "Message body", 2000);

    if (!messageBody && !hasAttachment) {
        throw new BadRequestError("Message body is required");
    }

    return {
        channelId: validateRequiredId(body.channelId, "Channel id"),
        body: messageBody
    };
}

export function validateDeleteChatMessage(body = {}) {
    return {
        messageId: validateRequiredId(body.messageId, "Message id")
    };
}

export function validateToggleChatMessageReaction(body = {}) {
    return {
        messageId: validateRequiredId(body.messageId, "Message id"),
        emoji: validateEnum(body.emoji, "Emoji", CHAT_REACTION_EMOJIS)
    };
}

export function validateMarkChatChannelAsRead(body = {}) {
    return {
        channelId: validateRequiredId(body.channelId, "Channel id")
    };
}
