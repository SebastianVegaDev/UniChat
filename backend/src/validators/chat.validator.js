import {
    validateEnum,
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";

const CHAT_REACTION_EMOJIS = ["👍", "😂", "❤️", "🔥", "😮", "😢", "🙏"];

export function validateSendChatMessage(body = {}) {
    return {
        channelId: validateRequiredId(body.channelId, "Channel id"),
        body: validateRequiredString(body.body, "Message body", 2000)
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