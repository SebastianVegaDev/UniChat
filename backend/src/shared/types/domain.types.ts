export type UserRole = "admin" | "teacher" | "student";

export type EntityId = number;

export type RequestBody = Record<string, unknown>;

export interface SessionUser {
    id: EntityId;
    role: UserRole;
}

export interface CourseFilter {
    courseId?: EntityId;
    courseTitle?: string;
    courseShortName?: string;
    courseSlug?: string;
}

export interface DatabaseRow {
    [key: string]: unknown;
}
