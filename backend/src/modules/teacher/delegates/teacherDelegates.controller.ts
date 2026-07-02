import { asyncHandler } from "../../../shared/http/asyncHandler.js";
import { validateTeacherDelegateRequest } from "../../../validators/teacherDelegates.validator.js";
import { requestTeacherDelegateService } from "./teacherDelegates.service.js";

export const requestTeacherDelegate = asyncHandler(async (req, res, next) => {
        const teacherId = req.user.id;
        const data = validateTeacherDelegateRequest(req.body);

        const courseMember = await requestTeacherDelegateService({
            ...data,
            teacherId
        });

        res.json(courseMember);
});
