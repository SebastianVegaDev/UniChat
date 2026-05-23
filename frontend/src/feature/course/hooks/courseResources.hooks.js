import {
    addResource,
    editResource,
    removeResource,
    updateResourceStatus
} from "../../bootstrap/updaters/bootstrap.updaters.js";
import {
    fetchDeleteResource,
    fetchEditResource,
    fetchToggleResource,
    fetchUploadResource
} from "../api/courseResources.api.js";

export function useCourseResourceActions({ updateBootstrap }) {
    async function handleUploadResource(resourceData) {
        try {
            const uploadedResource = await fetchUploadResource(resourceData);

            if (uploadedResource) {
                updateBootstrap((currentData) => addResource(currentData, uploadedResource));

                return true;
            }
        } catch (error) {
            console.log(error)
        }

        return false;
    }

    async function handleEditResource(resourceData) {
        try {
            const editedResource = await fetchEditResource(resourceData);

            if (editedResource) {
                updateBootstrap((currentData) => editResource(currentData, editedResource));

                return true;
            }
        } catch (error) {
            console.log(error)
        }

        return false;
    }

    async function handleToggleResource(resource) {
        const nextStatus = resource.status === "available" ? "unavailable" : "available";

        try {
            const toggledResource = await fetchToggleResource({
                resourceId: resource.id,
                status: nextStatus
            });

            if (toggledResource) {
                updateBootstrap((currentData) => updateResourceStatus(currentData, resource.id, nextStatus));
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteResource(resource) {
        try {
            const deletedResource = await fetchDeleteResource({
                resourceId: resource.id
            });

            if (deletedResource) {
                updateBootstrap((currentData) => removeResource(currentData, resource.id));
            }
        } catch (error) {
            console.log(error)
        }
    }

    return {
        handleUploadResource,
        handleEditResource,
        handleToggleResource,
        handleDeleteResource
    };
}
