import type { ReactNode } from "react";

export type EntityId = number;

export type Dictionary = Record<string, unknown>;

export type Updater<T> = T | ((current: T) => T);

export type AsyncFormHandler<TPayload = FormData> = (payload: TPayload) => Promise<boolean>;

export function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Ocurrió un error inesperado";
}

export interface User {
    id: EntityId;
    code?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "admin" | "teacher" | "student" | string;
    isBlocked?: boolean;
    avatarUrl?: string | null;
    createdAt?: string;
}

export interface Course {
    id: EntityId;
    shortName: string;
    title: string;
    slug: string;
    teacherId?: EntityId;
    classroomId?: EntityId | null;
    secondaryClassroomId?: EntityId | null;
    currentWeek?: number;
}

export interface Classroom {
    id: EntityId;
    name: string;
    type: string;
}

export interface CourseMember {
    id: EntityId;
    courseId: EntityId;
    userId: EntityId;
    courseRole: string;
    status: string;
    joinedAt?: string;
}

export interface CourseStat {
    courseId: EntityId;
    studentsCount?: number;
    delegatesCount?: number;
    unreadMessagesCount?: number;
    pendingItemsCount?: number;
    foldersCount?: number;
    lastActivityAt?: string | null;
}

export interface Announcement {
    id: EntityId;
    title: string;
    body: string;
    category: string;
    authorId?: EntityId;
    publishedAt?: string | null;
    status: string;
}

export interface ChatChannel {
    id: EntityId;
    courseId: EntityId;
    name: string;
    description?: string | null;
    type: string;
    isLocked?: boolean;
}

export interface ChatMessage {
    id: EntityId;
    channelId: EntityId;
    senderId?: EntityId;
    body?: string;
    attachmentType?: string;
    attachmentUrl?: string | null;
    attachmentName?: string;
    isPinned?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    reactions?: Dictionary[];
    readBy?: EntityId[];
}

export interface BootstrapSession {
    currentUserId: EntityId;
    activeChatChannels?: Array<{
        courseId: EntityId;
        channelId: EntityId;
    }>;
}

export interface Preferences {
    language: string;
    chatWallpaperName: string;
    chatWallpaperUrl: string;
    colorPalette: string;
    chatFontSize: string;
    showReadCheck: boolean;
    updatedAt?: string;
}

export interface PreferencesFormValues extends Preferences {
    chatWallpaperFile?: File | null;
    removeChatWallpaper?: boolean;
}

export interface CourseResource {
    id: EntityId;
    title: string;
    weekNumber: number;
    sizeBytes?: number;
    fileUrl?: string | null;
    url?: string | null;
    kind?: string;
    status?: string;
}

export interface AdminCourseView extends Course {
    membersCount?: number;
    users: Array<{
        id: EntityId;
        name: string;
        code?: string;
        email: string;
        status: string;
        roleLabel: string;
    }>;
}

export interface BootstrapData {
    session: BootstrapSession;
    users: User[];
    classrooms: Classroom[];
    courses: Course[];
    courseMembers: CourseMember[];
    courseStats: CourseStat[];
    classSessions: Dictionary[];
    calendarEvents: Dictionary[];
    resources: Dictionary[];
    announcements: Announcement[];
    chatChannels: ChatChannel[];
    chatMessages: ChatMessage[];
}

export interface AuthSession {
    token: string;
    user: User;
}

export interface ChildrenProps {
    children: ReactNode;
}
