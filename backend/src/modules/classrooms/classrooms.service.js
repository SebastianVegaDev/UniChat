import { findAllClasrooms } from "./classrooms.repository.js";

export async function getClassroomsService(userId) {
    return await findAllClasrooms(userId);
}