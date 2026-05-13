import { findRelatedUsersByUserId, findUserById } from "./users.repository.js";

export async function getUsersService(userId) {
    return await findRelatedUsersByUserId(userId);
}

export async function getCurrentUserService(userId) {
    return await findUserById(userId);
}
