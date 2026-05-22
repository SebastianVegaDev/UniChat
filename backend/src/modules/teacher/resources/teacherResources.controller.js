import {
    deleteTeacherResourceService,
    editTeacherResourceService,
    toggleTeacherResourceService,
    uploadTeacherResourceService,
} from "./teacherResources.service.js"
import {
    validateDeleteTeacherResource,
    validateEditTeacherResource,
    validateToggleTeacherResource,
    validateUploadTeacherResource
} from "../../../validators/teacherResources.validator.js";
import { getResourceFileData } from "./teacherResources.helper.js";
import { BadRequestError } from "../../../errors/index.js";

export async function deleteTeacherResource(req, res, next) {
    try {
        const teacherId = req.user.id;
        const { resourceId } = validateDeleteTeacherResource(req.body);

        const deleteResource = await deleteTeacherResourceService({resourceId, teacherId});

        res.json(deleteResource)
    } catch (error) {
        next(error)
    }
}

export async function editTeacherResource(req, res, next) {
    try {
        const teacherId = req.user.id;
        const data = validateEditTeacherResource(req.body);

        const editResource = await editTeacherResourceService({
            ...data,
            teacherId
        });

        res.json(editResource)
    } catch (error) {
        next(error)
    }
}

export async function toggleTeacherResource(req, res, next) {
    try {
        const teacherId = req.user.id;
        const data = validateToggleTeacherResource(req.body);

        const toggleResource = await toggleTeacherResourceService({
            ...data,
            teacherId
        });

        res.json(toggleResource)
    } catch (error) {
        next(error)
    }
}

export async function uploadTeacherResource(req, res, next) {
    try {
        const uploadedById = req.user.id;
        const fileData = getResourceFileData(req.file);

        if (!fileData) {
            throw new BadRequestError("Resource file is required");
        }

        const data = validateUploadTeacherResource({
            ...req.body,
            ...fileData
        });

        const uploadResource = await uploadTeacherResourceService({
            ...data,
            uploadedById,
        });

        res.json(uploadResource)
    } catch (error) {
        next(error)
    }
}
