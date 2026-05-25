import { apiDelete, apiFormPost, apiPost, apiPatch } from "../../../shared/api/client.js";

export async function fetchSendMessage(messageData) {
    if (messageData.photoFile) {
        const formData = new FormData();

        formData.append("channelId", messageData.channelId);
        formData.append("body", messageData.body ?? "");
        formData.append("photo", messageData.photoFile);

        return apiFormPost("/chat/message/send", formData);
    }

    return apiPost("/chat/message/send", messageData);
}

export async function fetchDeleteMessage(messageData) {
    return apiDelete("/chat/message/delete", messageData);
}

export async function fetchToggleMessageReaction(reactionData) {
    return apiPost("/chat/message/reaction", reactionData);
}

export async function fetchMarkChannelAsRead(channelData) {
    return apiPatch("/chat/channel/read", channelData)
}

export async function fetchToggleChatChannelLock(channelData) {
    return apiPatch("/teacher/chat/channel/lock", channelData);
}

export async function fetchSetFixedMessage(messageData) {
    return apiPatch("/teacher/chat/message/fixed", messageData);
}
