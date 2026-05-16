import { getClassroomsService } from "./classrooms.service.js";

export async function getClassrooms(req, res, next) {
    try {
        const userId = req.user.id;

        const classrooms = await getClassroomsService(userId);
        res.json(classrooms);
    } catch (error) {
        next(error);
    }
}