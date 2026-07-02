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
import { asyncHandler } from "../../../shared/http/asyncHandler.js";

export const deleteTeacherResource = asyncHandler (async (req, res, next) => {
    const teacherId = req.user.id;
    const { resourceId } = validateDeleteTeacherResource(req.body);

    const deleteResource = await deleteTeacherResourceService({resourceId, teacherId});

    res.json(deleteResource)
});

export const editTeacherResource = asyncHandler(async (req, res, next) => {
    const teacherId = req.user.id;
    const fileData = getResourceFileData(req.file);

    const data = await validateEditTeacherResource({
        ...req.body,
        ...(fileData ?? {})
    });

    const editResource = await editTeacherResourceService({
        ...data,
        teacherId
    });

    res.json(editResource)
});

export const toggleTeacherResource = asyncHandler(async (req, res, next) => {
    const teacherId = req.user.id;
    const data = validateToggleTeacherResource(req.body);

    const toggleResource = await toggleTeacherResourceService({
        ...data,
        teacherId
    });

    res.json(toggleResource)
});

export const uploadTeacherResource = asyncHandler(async (req, res, next) => {
    const uploadedById = req.user.id;
    const fileData = getResourceFileData(req.file);

    if (!fileData) {
        throw new BadRequestError("Resource file is required");
    }

    const data = validateUploadTeacherResource({
        ...req.body,
        ...(fileData ?? {})
    });

    const uploadResource = await uploadTeacherResourceService({
        ...data,
        uploadedById,
    });

    res.json(uploadResource)
});
