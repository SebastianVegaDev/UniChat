import type { DatabaseRow, EntityId } from "../../../shared/types/domain.types.js";
import type { EventType } from "../../ai/types/ai.types.js";

export type ResourceStatus = "available" | "unavailable";

export interface TeacherResourceInput {
    courseId: EntityId;
    weekNumber: number;
    title: string;
    kind: string;
    sizeBytes: number;
    uploadedById: EntityId;
    fileUrl: string | null;
    status: ResourceStatus;
}

export interface TeacherResourceEditInput extends Omit<TeacherResourceInput, "courseId" | "uploadedById"> {
    resourceId: EntityId;
    teacherId: EntityId;
}

export interface TeacherResourceIdentity {
    resourceId: EntityId;
    teacherId?: EntityId;
}

export interface TeacherCalendarEventInput {
    courseId: EntityId;
    createdById: EntityId;
    title: string;
    description: string;
    eventType: EventType;
    startsAt: string;
    endsAt: string | null;
}

export interface TeacherCalendarEventEditInput extends Omit<TeacherCalendarEventInput, "courseId" | "createdById"> {
    calendarEventId: EntityId;
    teacherId: EntityId;
}

export interface TeacherCalendarEventIdentity {
    calendarEventId: EntityId;
    teacherId?: EntityId;
}

export interface TeacherChatLockInput {
    channelId: EntityId;
    isLocked: boolean;
    teacherId?: EntityId;
}

export interface TeacherFixedMessageInput {
    messageId: EntityId;
    channelId: EntityId;
    teacherId?: EntityId;
}

export interface TeacherDelegateRequestInput {
    teacherId: EntityId;
    courseId: EntityId;
    code: string;
}

export interface CourseUserInput {
    courseId: EntityId;
    userId: EntityId;
}

export type TeacherRow = DatabaseRow;
