import { apiDelete, apiFormPost, apiPost, apiPatch } from "../../../shared/api/client.js";
import type { ChatMessage, EntityId } from "../../../shared/types/app.types.js";

interface SendMessagePayload {
    channelId: EntityId;
    body?: string;
    photoFile?: File | null;
}

interface MessageIdPayload {
    messageId: EntityId;
}

interface ChannelIdPayload {
    channelId: EntityId;
}

interface ChannelLockPayload extends ChannelIdPayload {
    isLocked: boolean;
}

interface ReactionPayload extends MessageIdPayload {
    emoji: string;
}

interface ReadChannelResponse {
    channelId: EntityId;
    readMessageIds: EntityId[];
}

interface LockedChannelResponse {
    isLocked: boolean;
}

export async function fetchSendMessage(messageData: SendMessagePayload): Promise<ChatMessage> {
    if (messageData.photoFile) {
        const formData = new FormData();

        formData.append("channelId", String(messageData.channelId));
        formData.append("body", messageData.body ?? "");
        formData.append("photo", messageData.photoFile);

        return apiFormPost<ChatMessage>("/chat/message/send", formData);
    }

    return apiPost<ChatMessage>("/chat/message/send", messageData);
}

export async function fetchDeleteMessage(messageData: MessageIdPayload): Promise<ChatMessage> {
    return apiDelete<ChatMessage>("/chat/message/delete", messageData);
}

export async function fetchToggleMessageReaction(reactionData: ReactionPayload): Promise<ChatMessage["reactions"]> {
    return apiPost<ChatMessage["reactions"]>("/chat/message/reaction", reactionData);
}

export async function fetchMarkChannelAsRead(channelData: ChannelIdPayload): Promise<ReadChannelResponse> {
    return apiPatch<ReadChannelResponse>("/chat/channel/read", channelData)
}

export async function fetchToggleChatChannelLock(channelData: ChannelLockPayload): Promise<LockedChannelResponse> {
    return apiPatch<LockedChannelResponse>("/teacher/chat/channel/lock", channelData);
}

export async function fetchSetFixedMessage(messageData: MessageIdPayload): Promise<ChatMessage> {
    return apiPatch<ChatMessage>("/teacher/chat/message/fixed", messageData);
}
