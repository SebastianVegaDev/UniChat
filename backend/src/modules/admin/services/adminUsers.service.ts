import { NotFoundError } from "../../../errors/index.js";
import {
    addAdminCourseUserByCode,
    updateAdminUserBlockedStatus
} from "../repositories/adminUsers.repository.js";
import type { AdminCourseUserInput, AdminRow, AdminUserBlockInput } from "../types/admin.types.js";

export async function updateAdminUserBlockedStatusService({
    userId,
    isBlocked
}: AdminUserBlockInput): Promise<AdminRow> {
    const user = await updateAdminUserBlockedStatus({ userId, isBlocked });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return user;
}

export async function addAdminCourseUserService({ courseId, code }: AdminCourseUserInput): Promise<AdminRow> {
    const courseMember = await addAdminCourseUserByCode({ courseId, code });

    if (!courseMember) {
        throw new NotFoundError("User not found");
    }

    return courseMember;
}
