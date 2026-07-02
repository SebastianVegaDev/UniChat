import {
    validateEnum,
    validateOptionalString,
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";
import { BadRequestError } from "../errors/index.js";

const CHAT_REACTION_EMOJIS = ["👍", "😂", "❤️", "🔥", "😮", "😢", "🙏"];

type SendChatMessageOptions = {
    hasAttachment?: boolean;
};

export function validateSendChatMessage(
    body: Record<string, unknown> = {},
    options: SendChatMessageOptions = {}
) {
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

export function validateDeleteChatMessage(body: Record<string, unknown> = {}) {
    return {
        messageId: validateRequiredId(body.messageId, "Message id")
    };
}

export function validateToggleChatMessageReaction(body: Record<string, unknown> = {}) {
    return {
        messageId: validateRequiredId(body.messageId, "Message id"),
        emoji: validateEnum(body.emoji, "Emoji", CHAT_REACTION_EMOJIS)
    };
}

export function validateMarkChatChannelAsRead(body: Record<string, unknown> = {}) {
    return {
        channelId: validateRequiredId(body.channelId, "Channel id")
    };
}
