import CourseLayout from "../../../shared/ui/layouts/course/CourseLayout.jsx";
import CourseHero from "../../../shared/ui/heroes/course/CourseHero.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import CourseContent from "../../../shared/ui/content/course/CourseContent.jsx";
import { useBootstrapData } from "../../bootstrap/hooks/useBootstrapData.js";
import { saveBootstrapCache } from "../../bootstrap/cache/bootstrap.cache.js";
import { mapCourseData } from "../mappers/course.mapper.js";
import {
    fetchDeleteTeacherResource,
    fetchToggleTeacherResource
} from "../api/teacherResources.api.js";
import { useParams } from "react-router-dom";

function CoursePage() {
    const { data, setData, isLoading, error } = useBootstrapData();
    const { courseSlug } = useParams();

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    const courseData = mapCourseData(data, courseSlug);
    const { currentUser, course, actions, resourcesSummary, resourcesByWeek, information } = courseData;

    async function handleToggleResource(resource) {
        const nextStatus = resource.status === "available" ? "unavailable" : "available";

        try {
            const toggledResource = await fetchToggleTeacherResource({
                resourceId: resource.id,
                status: nextStatus
            });

            if (toggledResource) {
                setData((currentData) => {
                    if (!currentData) return currentData;

                    const nextData = {
                        ...currentData,
                        resources: (currentData.resources ?? []).map((currentResource) => {
                            if (`${currentResource.id}` !== `${resource.id}`) return currentResource;

                            return {
                                ...currentResource,
                                status: nextStatus
                            };
                        })
                    };

                    saveBootstrapCache(nextData);

                    return nextData;
                });
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
                setData((currentData) => {
                    if (!currentData) return currentData;

                    const nextData = {
                        ...currentData,
                        resources: (currentData.resources ?? []).filter((currentResource) => {
                            return `${currentResource.id}` !== `${resource.id}`;
                        })
                    };

                    saveBootstrapCache(nextData);

                    return nextData;
                });
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
                actions={actions}
                resourcesSummary={resourcesSummary}
                resourcesByWeek={resourcesByWeek}
                information={information}
                handleToggleResource={handleToggleResource}
                handleDeleteResource={handleDeleteResource}
            />    
        </CourseLayout>
    );
}

export default CoursePage;
