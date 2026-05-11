import { findAllClasrooms } from "./classrooms.repository.js";

export async function getClassrooms() {
    return await findAllClasrooms;
}