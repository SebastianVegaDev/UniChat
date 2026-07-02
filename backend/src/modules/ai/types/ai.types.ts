import type { CourseFilter, EntityId } from "../../../shared/types/domain.types.js";

export type AiIntent =
    | "gratitude"
    | "farewell"
    | "greeting"
    | "preferences"
    | "chat_help"
    | "study_help"
    | "exams"
    | "tasks"
    | "resources"
    | "events"
    | "general";

export type FollowableIntent = "exams" | "tasks" | "events" | "resources";

export type DateFilter = "today" | "tomorrow" | "week" | "month";

export type EventType = "assignment" | "exam" | "reminder" | "announcement" | "other";

export interface AiCourseItem {
    courseId: EntityId;
    courseTitle: string;
    courseShortName: string;
    courseSlug: string;
}

export interface AiResource extends AiCourseItem {
    id: EntityId;
    weekNumber: number;
    title: string;
    kind: string;
    fileUrl: string;
    definition?: string | null;
    definitionModel?: string | null;
}

export interface AiCalendarEvent extends AiCourseItem {
    id: EntityId;
    title: string;
    description?: string | null;
    eventDate?: string | Date | null;
    startsAt?: string | Date | null;
    endsAt?: string | Date | null;
    eventType: EventType;
}

export interface AiClassSession extends AiCourseItem {
    id: EntityId;
    topic: string;
    startsAt: string | Date;
    endsAt: string | Date;
    classroomName?: string | null;
}

export interface AiHistoryMessage {
    type: "user" | "bot";
    body?: string;
    intent?: AiIntent | null;
    courseFilter?: CourseFilter | null;
}

export interface QuestionAnalysis {
    currentIntent: AiIntent;
    previousIntent: AiIntent | null;
    shouldUsePreviousIntent: boolean;
    courseFilter: CourseFilter | null;
    dateFilter: DateFilter | null;
    weekFilter: Set<number>;
}

export interface AcademicQuestionInput {
    userId: EntityId;
    question: string;
    history?: AiHistoryMessage[];
}

export interface AiResponseResource {
    id: EntityId;
    title: string;
    kind: string;
    fileUrl: string;
    courseTitle: string;
    weekNumber: number;
}

export interface AiUseCaseResponse {
    answer: string | null;
    needsResource: boolean;
    intent: AiIntent;
    courseFilter: CourseFilter | null;
    resources?: AiResponseResource[];
}

export interface ResourceDefinition {
    resourceId: EntityId;
    definition: string;
    model: string;
}
