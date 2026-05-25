import { validateTeacherDelegateRequest } from "../../../validators/teacherDelegates.validator.js";
import { requestTeacherDelegateService } from "./teacherDelegates.service.js";

export async function requestTeacherDelegate(req, res, next) {
    try {
        const teacherId = req.user.id;
        const data = validateTeacherDelegateRequest(req.body);

        const courseMember = await requestTeacherDelegateService({
            ...data,
            teacherId
        });

        res.json(courseMember);
    } catch (error) {
        next(error);
    }
}
