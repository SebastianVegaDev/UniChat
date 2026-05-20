import "./CourseResourceOptions.css";

function CourseResourceOptions() {
    return (
        <div className="course-resource-options" onClick={(event) => event.stopPropagation()}>
            <p className="course-resource-option">Edit</p>
            <p className="course-resource-option">Toggle availability</p>
            <p className="course-resource-option">Delete</p>
        </div>
    );
}

export default CourseResourceOptions;
