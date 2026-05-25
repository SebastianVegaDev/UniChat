import "./CourseContent.css";
import CourseActions from "./actions/CourseActions.jsx";
import CourseResources from "./resources/CourseResources.jsx";
import CourseInformation from "./information/CourseInformation.jsx";

function CourseContent({ currentUser, course, actions, resourcesSummary, resourcesByWeek, information, delegateCandidates, handleUploadResource, handleEditResource, handleToggleResource, handleDeleteResource, handleRequestDelegate }) {
    
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
                currentUser={currentUser}
                course={course}
                information={information}
                delegateCandidates={delegateCandidates}
                handleRequestDelegate={handleRequestDelegate}
            />
        </div>
    );
}

export default CourseContent;
