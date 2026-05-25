import {
    validateEnum,
    validateNonNegativeInteger,
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";
import { BadRequestError } from "../errors/index.js";

const ANNOUNCEMENT_CATEGORIES = ["academic", "campus", "systems", "general"];
const ANNOUNCEMENT_STATUSES = ["draft", "published", "archived"];

export function validateAdminCourse(body = {}) {
    return {
        shortName: validateRequiredString(body.shortName, "Short name", 10),
        title: validateRequiredString(body.title, "Title", 100),
        slug: validateRequiredString(body.slug, "Slug", 120),
        ...validateAdminCourseSettings(body)
    };
}

export function validateAdminCourseSettings(body = {}) {
    return {
        teacherId: validateRequiredId(body.teacherId, "Teacher"),
        classroomId: validateNonNegativeInteger(body.classroomId, "Classroom"),
        secondaryClassroomId: validateNonNegativeInteger(body.secondaryClassroomId, "Second classroom"),
        currentWeek: validateRequiredId(body.currentWeek, "Current week")
    };
}

export function validateAdminAnnouncement(body = {}) {
    return {
        title: validateRequiredString(body.title, "Title", 150),
        body: validateRequiredString(body.body, "Body", 5000),
        category: validateEnum(body.category, "Category", ANNOUNCEMENT_CATEGORIES),
        status: validateEnum(body.status, "Status", ANNOUNCEMENT_STATUSES)
    };
}

export function validateAdminUserId(body = {}) {
    return {
        userId: validateRequiredId(body.userId, "User")
    };
}

export function validateAdminUserBlock(body = {}, currentUserId) {
    const { userId } = validateAdminUserId(body);
    const adminUserId = validateRequiredId(currentUserId, "Current user");

    if (userId === adminUserId) {
        throw new BadRequestError("You cannot block yourself");
    }

    return { userId };
}

export function validateAdminDelegateAction(body = {}) {
    return {
        courseId: validateRequiredId(body.courseId, "Course"),
        userId: validateRequiredId(body.userId, "User")
    };
}

export function validateAdminCourseUser(body = {}) {
    return {
        code: validateRequiredString(body.code, "Code", 8)
    };
}

export function validateAnnouncementStatus(body = {}) {
    return {
        status: validateEnum(body.status, "Status", ANNOUNCEMENT_STATUSES)
    };
}
