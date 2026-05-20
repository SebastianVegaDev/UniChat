import "./CourseContent.css";
import CourseActions from "./actions/CourseActions.jsx";
import CourseResources from "./resources/CourseResources.jsx";
import CourseInformation from "./information/CourseInformation.jsx";

function CourseContent({ currentUser, actions, resourcesSummary, resourcesByWeek, information, handleToggleResource, handleDeleteResource }) {
    
    return (
        <div className="course-content">
            <div className="course-body">
                <CourseActions 
                    actions={actions}
                />
                <CourseResources
                    currentUser={currentUser}
                    resourcesSummary={resourcesSummary}
                    resourcesByWeek={resourcesByWeek}
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
