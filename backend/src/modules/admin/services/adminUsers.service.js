import { NotFoundError } from "../../../errors/index.js";
import {
    addAdminCourseUserByCode,
    updateAdminUserBlockedStatus
} from "../repositories/adminUsers.repository.js";

export async function updateAdminUserBlockedStatusService({ userId, isBlocked }) {
    const user = await updateAdminUserBlockedStatus({ userId, isBlocked });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return user;
}

export async function addAdminCourseUserService({ courseId, code }) {
    const courseMember = await addAdminCourseUserByCode({ courseId, code });

    if (!courseMember) {
        throw new NotFoundError("User not found");
    }

    return courseMember;
}