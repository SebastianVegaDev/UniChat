import CourseLayout from "../../../shared/ui/layouts/course/CourseLayout.jsx";
import CourseHero from "../../../shared/ui/heroes/course/CourseHero.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import CourseContent from "../../../shared/ui/content/course/CourseContent.jsx";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import {
    addResource,
    editResource,
    removeResource,
    updateResourceStatus
} from "../../bootstrap/updaters/bootstrap.updaters.js";
import { mapCourseData } from "../mappers/course.mapper.js";
import {
    fetchDeleteTeacherResource,
    fetchEditTeacherResource,
    fetchUploadTeacherResource,
    fetchToggleTeacherResource
} from "../api/teacherResources.api.js";
import { useParams } from "react-router-dom";

function CoursePage() {
    const { data, updateBootstrap, isLoading, error } = useBootstrap();
    const { courseSlug } = useParams();

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    const courseData = mapCourseData(data, courseSlug);
    const { currentUser, course, actions, resourcesSummary, resourcesByWeek, information } = courseData;

    async function handleUploadResource(resourceData) {
        try {
            const uploadedResource = await fetchUploadTeacherResource(resourceData);

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
            const editedResource = await fetchEditTeacherResource(resourceData);

            if (editedResource) {
                updateBootstrap((currentData) => editResource(currentData, resourceData));

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
            const toggledResource = await fetchToggleTeacherResource({
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
            const deletedResource = await fetchDeleteTeacherResource({
                resourceId: resource.id
            });

            if (deletedResource) {
                updateBootstrap((currentData) => removeResource(currentData, resource.id));
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <CourseLayout>
            <CourseHero 
                course={course}
            />    
            <CourseContent 
                currentUser={currentUser}
                course={course}
                actions={actions}
                resourcesSummary={resourcesSummary}
                resourcesByWeek={resourcesByWeek}
                information={information}
                handleUploadResource={handleUploadResource}
                handleEditResource={handleEditResource}
                handleToggleResource={handleToggleResource}
                handleDeleteResource={handleDeleteResource}
            />    
        </CourseLayout>
    );
}

export default CoursePage;
