import { findAllUsers } from "./users.repository.js";

export async function getUsers() {
    return await findAllUsers;
}