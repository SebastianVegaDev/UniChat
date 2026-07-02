import { NotFoundError } from "../../../errors/index.js";
import {
    approveAdminDelegate,
    rejectAdminDelegate
} from "../repositories/adminDelegates.repository.js";
import type { AdminDelegateActionInput, AdminRow } from "../types/admin.types.js";

export async function approveAdminDelegateService(data: AdminDelegateActionInput): Promise<AdminRow> {
    const courseMember = await approveAdminDelegate(data);

    if (!courseMember) {
        throw new NotFoundError("Delegate request not found");
    }

    return courseMember;
}

export async function rejectAdminDelegateService(data: AdminDelegateActionInput): Promise<AdminRow> {
    const courseMember = await rejectAdminDelegate(data);

    if (!courseMember) {
        throw new NotFoundError("Delegate request not found");
    }

    return courseMember;
}
