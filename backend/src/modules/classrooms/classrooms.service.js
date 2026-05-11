import { findAllClasrooms } from "./classrooms.repository.js";

export async function getClassroomsService() {
    return await findAllClasrooms();
}