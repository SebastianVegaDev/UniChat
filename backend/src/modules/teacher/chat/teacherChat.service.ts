import { 
    updateTeacherChatChannelLock,
    updateTeacherFixedMessage
} from "./teacherChat.repository.js";
import { NotFoundError } from "../../../errors/index.js";
import { findTeacherChannelAccess } from "../../access/access.repository.js";
import type { TeacherChatLockInput, TeacherFixedMessageInput, TeacherRow } from "../types/teacher.types.js";

export async function toggleTeacherChatChannelLockService(data: Required<TeacherChatLockInput>): Promise<TeacherRow> {
    const {
        channelId,
        isLocked,
        teacherId
    } = data

    const access = await findTeacherChannelAccess({
        teacherId,
        channelId
    });

    if (!access) {
        throw new NotFoundError("Chat channel not found");
    }

    const channel = await updateTeacherChatChannelLock({
        channelId,
        isLocked
    });

    if (!channel) {
        throw new NotFoundError("Chat channel not found");
    }

    return channel;
}

export async function setTeacherFixedMessageService(data: Required<TeacherFixedMessageInput>): Promise<TeacherRow> {
    const {
        messageId,
        channelId,
        teacherId
    } = data

    const access = await findTeacherChannelAccess({
        teacherId,
        channelId
    });

    if (!access) {
        throw new NotFoundError("Chat channel not found");
    }

    const message = await updateTeacherFixedMessage({
        messageId,
        channelId
    });

    if (!message) {
        throw new NotFoundError("Chat message not found");
    }

    return message;
}
