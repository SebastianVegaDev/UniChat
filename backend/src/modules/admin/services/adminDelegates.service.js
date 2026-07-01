import { NotFoundError } from "../../../errors/index.js";
import {
    approveAdminDelegate,
    rejectAdminDelegate
} from "../repositories/adminDelegates.repository.js";

export async function approveAdminDelegateService(data) {
    const courseMember = await approveAdminDelegate(data);

    if (!courseMember) {
        throw new NotFoundError("Delegate request not found");
    }

    return courseMember;
}

export async function rejectAdminDelegateService(data) {
    const courseMember = await rejectAdminDelegate(data);

    if (!courseMember) {
        throw new NotFoundError("Delegate request not found");
    }

    return courseMember;
}