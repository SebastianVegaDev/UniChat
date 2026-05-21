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

export async function deleteTeacherResource(req, res, next) {
    try {
        const { resourceId } = validateDeleteTeacherResource(req.body);

        const deleteResource = await deleteTeacherResourceService(resourceId);

        res.json(deleteResource)
    } catch (error) {
        next(error)
    }
}

export async function editTeacherResource(req, res, next) {
    try {
        const data = validateEditTeacherResource(req.body);

        const editResource = await editTeacherResourceService(data);

        res.json(editResource)
    } catch (error) {
        next(error)
    }
}

export async function toggleTeacherResource(req, res, next) {
    try {
        const data = validateToggleTeacherResource(req.body);

        const toggleResource = await toggleTeacherResourceService(data);

        res.json(toggleResource)
    } catch (error) {
        next(error)
    }
}

export async function uploadTeacherResource(req, res, next) {
    try {
        const uploadedById = req.user.id;
        const data = validateUploadTeacherResource(req.body);

        const uploadResource = await uploadTeacherResourceService({
            ...data,
            uploadedById,
        });

        res.json(uploadResource)
    } catch (error) {
        next(error)
    }
}
