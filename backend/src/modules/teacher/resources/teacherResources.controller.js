import {
    deleteTeacherResourceService,
    editTeacherResourceService,
    toggleTeacherResourceService,
    uploadTeacherResourceService,
} from "./teacherResources.service.js"

export async function deleteTeacherResource(req, res, next) {
    try {
        const resourceId = req.body.resourceId;

        const deleteResource = await deleteTeacherResourceService(resourceId);

        res.json(deleteResource)
    } catch (error) {
        next(error)
    }
}

export async function editTeacherResource(req, res, next) {
    try {
        const resourceId = req.body.resourceId;
        const weekNumber = req.body.weekNumber;
        const title = req.body.title;
        const kind = req.body.kind;
        const sizeBytes = req.body.sizeBytes;
        const fileUrl = req.body.fileUrl;
        const status = req.body.status;

        const editResource = await editTeacherResourceService({
            resourceId,
            weekNumber,
            title,
            kind,
            sizeBytes,
            fileUrl,
            status
        });

        res.json(editResource)
    } catch (error) {
        next(error)
    }
}

export async function toggleTeacherResource(req, res, next) {
    try {
        const resourceId = req.body.resourceId;
        const status = req.body.status;

        const toggleResource = await toggleTeacherResourceService({
            resourceId,
            status
        });

        res.json(toggleResource)
    } catch (error) {
        next(error)
    }
}

export async function uploadTeacherResource(req, res, next) {
    try {
        const uploadedById = req.user.id;
        const courseId = req.body.courseId;
        const weekNumber = req.body.weekNumber;
        const title = req.body.title;
        const kind = req.body.kind;
        const sizeBytes = req.body.sizeBytes;
        const fileUrl = req.body.fileUrl;
        const status = req.body.status;

        const uploadResource = await uploadTeacherResourceService({
            courseId,
            weekNumber,
            title,
            kind,
            sizeBytes,
            uploadedById,
            fileUrl,
            status
        });

        res.json(uploadResource)
    } catch (error) {
        next(error)
    }
}
