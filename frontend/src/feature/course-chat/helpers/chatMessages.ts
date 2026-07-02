export const MESSAGE_EMOJIS = ["👍", "😂", "❤️", "🔥", "😮", "😢", "🙏"];

export function isMyChatMessage(message) {
    return message.type === "message-me";
}

export function getChatMessageClassName(message) {
    if (isMyChatMessage(message)) return "chat-message-row-me";

    return "chat-message-row-other";
}

export function canUseComposer({ currentUser, isChatLocked }) {
    return !isChatLocked || currentUser?.role === "teacher";
}

export function getChatMessageBody({ message, chatTexts }) {
    if (message.isDeleted) return chatTexts.deletedMessage;

    return message.body;
}