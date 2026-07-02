import type { DatabaseRow, EntityId } from "../../../shared/types/domain.types.js";

export interface ChannelUserInput {
    channelId: EntityId;
    userId: EntityId;
}

export interface MessageUserInput {
    messageId: EntityId;
    userId: EntityId;
}

export interface MessageReactionInput extends MessageUserInput {
    emoji: string;
}

export interface CreateChatMessageInput extends ChannelUserInput {
    body: string;
    attachmentType?: string;
    attachmentUrl?: string | null;
    attachmentName?: string;
}

export interface ChatPhotoData {
    attachmentType?: "photo";
    attachmentUrl?: string | null;
    attachmentName?: string;
}

export type ChatRow = DatabaseRow;
