import "./CourseContent.css";
import CourseActions from "./actions/CourseActions.jsx";
import CourseResources from "./resources/CourseResources.jsx";
import CourseInformation from "./information/CourseInformation.jsx";

function CourseContent({ currentUser, course, actions, resourcesSummary, resourcesByWeek, information, handleUploadResource, handleEditResource, handleToggleResource, handleDeleteResource }) {
    
    return (
        <div className="course-content">
            <div className="course-body">
                <CourseActions 
                    actions={actions}
                />
                <CourseResources
                    currentUser={currentUser}
                    course={course}
                    resourcesSummary={resourcesSummary}
                    resourcesByWeek={resourcesByWeek}
                    handleUploadResource={handleUploadResource}
                    handleEditResource={handleEditResource}
                    handleToggleResource={handleToggleResource}
                    handleDeleteResource={handleDeleteResource}
                />
            </div>
            <CourseInformation 
                information={information}
            />
        </div>
    );
}

export default CourseContent;
