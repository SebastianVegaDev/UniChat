import "./CourseResourceWeek.css";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import CourseResourceCard from "./CourseResourceCard.jsx";

function CourseResourceWeek({ currentUser, resourcesItem, handleResourceClick, handleEditResource, handleToggleResource, handleDeleteResource }) {
    const { course } = usePreferenceTexts();

    return (
        <article className="course-resource-week">
            <h4>{course.week} {resourcesItem.weekNumber}</h4>

            <div className="course-resource-week-files">
                {resourcesItem.files.map((resource) => (
                    <CourseResourceCard
                        key={resource.id}
                        currentUser={currentUser}
                        resource={resource}
                        handleResourceClick={handleResourceClick}
                        handleEditResource={handleEditResource}
                        handleToggleResource={handleToggleResource}
                        handleDeleteResource={handleDeleteResource}
                    />
                ))}
            </div>
        </article>
    );
}

export default CourseResourceWeek;