import CourseLayout from "../../../shared/ui/layouts/course/CourseLayout.jsx";
import CourseHero from "../../../shared/ui/heroes/course/CourseHero.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import CourseContent from "../../../shared/ui/content/course/CourseContent.jsx";
import { useBootstrapData } from "../../bootstrap/hooks/useBootstrapData.js";
import { mapCourseData } from "../mappers/course.mapper.js";
import { useParams } from "react-router-dom";

function CoursePage() {
    const { data, isLoading, error } = useBootstrapData();
    const { courseSlug } = useParams();

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
                actions={actions}
                resourcesSummary={resourcesSummary}
                resourcesByWeek={resourcesByWeek}
                information={information}
            />    
        </CourseLayout>
    );
}

export default CoursePage;
