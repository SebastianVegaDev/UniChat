import "./CourseContent.css";
import CourseActions from "./actions/CourseActions.jsx";
import CourseResources from "./resources/CourseResources.jsx";
import CourseInformation from "./information/CourseInformation.jsx";

function CourseContent({ actions, resourcesSummary, resourcesByWeek, information }) {
    
    return (
        <div className="course-content">
            <div className="course-body">
                <CourseActions 
                    actions={actions}
                />
                <CourseResources 
                    resourcesSummary={resourcesSummary}
                    resourcesByWeek={resourcesByWeek}
                />
            </div>
            <CourseInformation 
                information={information}
            />
        </div>
    );
}

export default CourseContent;
