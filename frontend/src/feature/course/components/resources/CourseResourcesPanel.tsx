import "./CourseResourcesPanel.css";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import EmptyText from "../../../../shared/ui/primitives/empty/EmptyText.jsx";
import CourseResourceCreateMenu from "./CourseResourceCreateMenu.jsx";
import CourseResourceWeek from "./CourseResourceWeek.jsx";
import { openCourseResource } from "../../helpers/courseResources.js";

function CourseResourcesPanel({ currentUser, course, resourcesSummary, resourcesByWeek, handleUploadResource, handleEditResource, handleToggleResource, handleDeleteResource }) {
    const { course: courseTexts } = usePreferenceTexts();
    const isTeacher = currentUser?.role === "teacher";

    return (
        <section className="course-resources-panel course-card">
            <div className="course-card-header">
                <div>
                    <h3>{courseTexts.resourcesByWeek}</h3>
                    <span>{resourcesSummary.foldersCount} {courseTexts.folders}</span>
                </div>

                {isTeacher && (
                    <CourseResourceCreateMenu
                        course={course}
                        handleUploadResource={handleUploadResource}
                    />
                )}
            </div>

            <div className="course-resources-weeks">
                {resourcesByWeek.length === 0 && (
                    <EmptyText>{courseTexts.noResources ?? "No resources available."}</EmptyText>
                )}

                {resourcesByWeek.map((resourcesItem) => (
                    <CourseResourceWeek
                        key={resourcesItem.id}
                        currentUser={currentUser}
                        resourcesItem={resourcesItem}
                        handleResourceClick={openCourseResource}
                        handleEditResource={handleEditResource}
                        handleToggleResource={handleToggleResource}
                        handleDeleteResource={handleDeleteResource}
                    />
                ))}
            </div>
        </section>
    );
}

export default CourseResourcesPanel;