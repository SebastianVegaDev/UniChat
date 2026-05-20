import {
    insertTeacherResource,
    softDeleteTeacherResource,
    toggleTeacherResourceAvailability,
    updateTeacherResource
} from "./teacherResources.repository.js"

export async function deleteTeacherResourceService(resourceId) {

    return await softDeleteTeacherResource({resourceId});
}

export async function editTeacherResourceService(data) {
    const {
        resourceId,
        weekNumber,
        title,
        kind,
        sizeBytes,
        fileUrl,
        status
    } = data

    return await updateTeacherResource({
        resourceId,
        weekNumber,
        title,
        kind,
        sizeBytes,
        fileUrl,
        status
    });
}

export async function toggleTeacherResourceService({status, resourceId}) {
    return await toggleTeacherResourceAvailability({status, resourceId});
}

export async function uploadTeacherResourceService(data) {
    const {
        courseId,
        weekNumber, 
        title, 
        kind, 
        sizeBytes, 
        uploadedById,
        fileUrl,
        status
    } = data

    return await insertTeacherResource({
        courseId,
        weekNumber, 
        title, 
        kind, 
        sizeBytes, 
        uploadedById,
        fileUrl,
        status
    });
}
