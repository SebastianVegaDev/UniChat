import { getClassroomsService } from "./classrooms.service.js";

const userId = 1;

export async function getClassrooms(req, res, next) {
    try {
        const classrooms = await getClassroomsService(userId);
        res.json(classrooms);
    } catch (error) {
        next(error);
    }
}