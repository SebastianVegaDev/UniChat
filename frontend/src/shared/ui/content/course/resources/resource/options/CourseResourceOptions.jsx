import "./CourseResourceOptions.css";

function CourseResourceOptions({ resource, closeOptions, openEditForm, handleToggleResource, handleDeleteResource }) {
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
            <p className="course-resource-option" onClick={editResource}>Edit</p>
            <p className="course-resource-option" onClick={toggleResource}>Toggle availability</p>
            <p className="course-resource-option" onClick={deleteResource}>Delete</p>
        </div>
    );
}

export default CourseResourceOptions;
