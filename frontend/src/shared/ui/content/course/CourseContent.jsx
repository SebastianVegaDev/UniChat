import "./CourseContent.css";
import CourseActions from "./actions/CourseActions.jsx";
import CourseResources from "./resources/CourseResources.jsx";
import CourseInformation from "./information/CourseInformation.jsx";

function CourseContent() {
    return (
        <div className="course-content">
            <div className="course-body">
                <CourseActions />
                <CourseResources />
            </div>
            <CourseInformation />
        </div>
    );
}

export default CourseContent;
