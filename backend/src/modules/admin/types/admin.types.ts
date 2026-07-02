import type { DatabaseRow, EntityId } from "../../../shared/types/domain.types.js";

export type AnnouncementCategory = "academic" | "campus" | "systems" | "general";
export type AnnouncementStatus = "draft" | "published" | "archived";

export interface AdminCourseInput {
    shortName: string;
    title: string;
    slug: string;
    teacherId: EntityId;
    classroomId: number;
    secondaryClassroomId: number;
    currentWeek: number;
}

export type AdminCourseSettingsInput = Omit<AdminCourseInput, "shortName" | "title" | "slug">;

export interface AdminAnnouncementInput {
    title: string;
    body: string;
    category: AnnouncementCategory;
    status: AnnouncementStatus;
    authorId?: EntityId;
}

export interface AdminUserBlockInput {
    userId: EntityId;
    isBlocked: boolean;
}

export interface AdminCourseUserInput {
    courseId: EntityId;
    code: string;
}

export interface AdminDelegateActionInput {
    courseId: EntityId;
    userId: EntityId;
}

export type AdminRow = DatabaseRow;
