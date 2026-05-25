import "./CourseResourceOptions.css";
import { usePreferenceTexts } from "../../../../../../../feature/preferences/context/PreferencesContext.js";

function CourseResourceOptions({ resource, closeOptions, openEditForm, handleToggleResource, handleDeleteResource }) {
    const { common, course } = usePreferenceTexts();

    function editResource(event) {
        event.stopPropagation();
        openEditForm();
    }

    function toggleResource(event) {
        event.stopPropagation();
        handleToggleResource(resource);
        closeOptions();
    }

    function deleteResource(event) {
        event.stopPropagation();
        handleDeleteResource(resource);
        closeOptions();
    }

    return (
        <div className="course-resource-options" onClick={(event) => event.stopPropagation()}>
            <p className="course-resource-option" onClick={editResource}>{common.edit}</p>
            <p className="course-resource-option" onClick={toggleResource}>{course.toggleAvailability}</p>
            <p className="course-resource-option" onClick={deleteResource}>{common.delete}</p>
        </div>
    );
}

export default CourseResourceOptions;
