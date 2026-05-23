import CourseLayout from "../../../shared/ui/layouts/course/CourseLayout.jsx";
import CourseHero from "../../../shared/ui/heroes/course/CourseHero.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import CourseContent from "../../../shared/ui/content/course/CourseContent.jsx";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import { mapCourseData } from "../mappers/course.mapper.js";
import { useCourseResourceActions } from "../hooks/courseResources.hooks.js";
import { useParams } from "react-router-dom";

function CoursePage() {
    const { data, updateBootstrap, isLoading, error } = useBootstrap();
    const { courseSlug } = useParams();
    const {
        handleUploadResource,
        handleEditResource,
        handleToggleResource,
        handleDeleteResource
    } = useCourseResourceActions({ updateBootstrap });

    if (isLoading) return <LoadingLayout />
    if (error) return <p>{error}</p>

    const courseData = mapCourseData(data, courseSlug);
    const { currentUser, course, actions, resourcesSummary, resourcesByWeek, information } = courseData;

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
