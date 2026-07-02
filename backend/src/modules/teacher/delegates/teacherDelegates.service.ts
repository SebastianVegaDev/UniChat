import { BadRequestError, NotFoundError } from "../../../errors/index.js";
import { findTeacherCourseAccess } from "../../access/access.repository.js";
import {
    countCourseDelegates,
    findCourseMember,
    findUserByCode,
    upsertTeacherDelegateRequest
} from "./teacherDelegates.repository.js";
import type { TeacherDelegateRequestInput, TeacherRow } from "../types/teacher.types.js";

export async function requestTeacherDelegateService({
    teacherId,
    courseId,
    code
}: TeacherDelegateRequestInput): Promise<TeacherRow | null> {
    const access = await findTeacherCourseAccess({ teacherId, courseId });

    if (!access) {
        throw new NotFoundError("Course not found");
    }

    const user = await findUserByCode(code);

    if (!user || user.isBlocked) {
        throw new NotFoundError("User not found");
    }

    const userId = Number(user.id);
    const existingMember = await findCourseMember({ courseId, userId });

    if (existingMember?.courseRole === "delegate" && existingMember.status === "active") {
        return existingMember;
    }

    const delegatesCount = await countCourseDelegates(courseId);

    if (delegatesCount >= 2) {
        throw new BadRequestError("This course already has 2 delegate candidates");
    }

    return await upsertTeacherDelegateRequest({
        courseId,
        userId
    });
}
