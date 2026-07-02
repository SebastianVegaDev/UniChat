import "./CourseResourceMenu.css";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";

function CourseResourceMenu({ resource, closeMenu, openEditForm, handleToggleResource, handleDeleteResource }) {
    const { common, course } = usePreferenceTexts();

    function editResource(event) {
        event.stopPropagation();
        openEditForm();
    }

    function toggleResource(event) {
        event.stopPropagation();
        handleToggleResource(resource);
        closeMenu();
    }

    function deleteResource(event) {
        event.stopPropagation();
        handleDeleteResource(resource);
        closeMenu();
    }

    return (
        <div className="course-resource-menu" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={editResource}>{common.edit}</button>
            <button type="button" onClick={toggleResource}>{course.toggleAvailability}</button>
            <button type="button" onClick={deleteResource}>{common.delete}</button>
        </div>
    );
}

export default CourseResourceMenu;