import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import CourseContent from "../components/CourseContent.jsx";
import CourseHero from "../components/CourseHero.jsx";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import { mapCourseData } from "../mappers/course.mapper.js";
import { useCourseResourceActions } from "../hooks/courseResources.hooks.js";
import { useCourseDelegateActions } from "../hooks/courseDelegates.hooks.js";
import { useParams } from "react-router-dom";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import NotFoundPage from "../../not-found/pages/NotFoundPage.jsx";

function CoursePage() {
    const { data, updateBootstrap, isLoading, error } = useBootstrap();
    const { courseSlug } = useParams();
    const texts = usePreferenceTexts();
    const {
        handleUploadResource,
        handleEditResource,
        handleToggleResource,
        handleDeleteResource
    } = useCourseResourceActions({ updateBootstrap });
    const { handleRequestDelegate } = useCourseDelegateActions({ updateBootstrap });

    if (isLoading) return <LoadingLayout />;
    if (error) return <p>{error}</p>;

    const courseData = mapCourseData(data, courseSlug, texts);

    if (courseData.notFound) return <NotFoundPage />;

    const {
        currentUser,
        course,
        actions,
        resourcesSummary,
        resourcesByWeek,
        information,
        delegateCandidates
    } = courseData;

    return (
        <SectionLayout>
            <CourseHero course={course} />

            <CourseContent
                currentUser={currentUser}
                course={course}
                actions={actions}
                resourcesSummary={resourcesSummary}
                resourcesByWeek={resourcesByWeek}
                information={information}
                delegateCandidates={delegateCandidates}
                handleUploadResource={handleUploadResource}
                handleEditResource={handleEditResource}
                handleToggleResource={handleToggleResource}
                handleDeleteResource={handleDeleteResource}
                handleRequestDelegate={handleRequestDelegate}
            />
        </SectionLayout>
    );
}

export default CoursePage;