import {
    validateEnum,
    validateNonNegativeInteger,
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";
import { BadRequestError } from "../errors/index.js";

const ANNOUNCEMENT_CATEGORIES = ["academic", "campus", "systems", "general"] as const;
const ANNOUNCEMENT_STATUSES = ["draft", "published", "archived"] as const;

export function validateAdminCourse(body: Record<string, unknown> = {}) {
    return {
        shortName: validateRequiredString(body.shortName, "Short name", 10),
        title: validateRequiredString(body.title, "Title", 100),
        slug: validateRequiredString(body.slug, "Slug", 120),
        ...validateAdminCourseSettings(body)
    };
}

export function validateAdminCourseSettings(body: Record<string, unknown> = {}) {
    return {
        teacherId: validateRequiredId(body.teacherId, "Teacher"),
        classroomId: validateNonNegativeInteger(body.classroomId, "Classroom"),
        secondaryClassroomId: validateNonNegativeInteger(body.secondaryClassroomId, "Second classroom"),
        currentWeek: validateRequiredId(body.currentWeek, "Current week")
    };
}

export function validateAdminAnnouncement(body: Record<string, unknown> = {}) {
    return {
        title: validateRequiredString(body.title, "Title", 150),
        body: validateRequiredString(body.body, "Body", 5000),
        category: validateEnum(body.category, "Category", ANNOUNCEMENT_CATEGORIES),
        status: validateEnum(body.status, "Status", ANNOUNCEMENT_STATUSES)
    };
}

export function validateAdminUserId(body: Record<string, unknown> = {}) {
    return {
        userId: validateRequiredId(body.userId, "User")
    };
}

export function validateAdminUserBlock(body: Record<string, unknown> = {}, currentUserId: unknown) {
    const { userId } = validateAdminUserId(body);
    const adminUserId = validateRequiredId(currentUserId, "Current user");

    if (userId === adminUserId) {
        throw new BadRequestError("You cannot block yourself");
    }

    return { userId };
}

export function validateAdminDelegateAction(body: Record<string, unknown> = {}) {
    return {
        courseId: validateRequiredId(body.courseId, "Course"),
        userId: validateRequiredId(body.userId, "User")
    };
}

export function validateAdminCourseUser(body: Record<string, unknown> = {}) {
    return {
        code: validateRequiredString(body.code, "Code", 8)
    };
}

export function validateAnnouncementStatus(body: Record<string, unknown> = {}) {
    return {
        status: validateEnum(body.status, "Status", ANNOUNCEMENT_STATUSES)
    };
}
