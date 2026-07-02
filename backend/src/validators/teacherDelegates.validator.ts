import {
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";

export function validateTeacherDelegateRequest(body: Record<string, unknown> = {}) {
    return {
        courseId: validateRequiredId(body.courseId, "Course"),
        code: validateRequiredString(body.code, "Code", 8)
    };
}
