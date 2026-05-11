import { findAllUsers } from "./users.repository.js";

export async function getUsersService() {
    return await findAllUsers();
}