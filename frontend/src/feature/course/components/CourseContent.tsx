import "./CourseContent.css";
import CourseActions from "./actions/CourseActions.jsx";
import CourseInformationPanel from "./information/CourseInformationPanel.jsx";
import CourseResourcesPanel from "./resources/CourseResourcesPanel.jsx";

function CourseContent({ currentUser, course, actions, resourcesSummary, resourcesByWeek, information, delegateCandidates, handleUploadResource, handleEditResource, handleToggleResource, handleDeleteResource, handleRequestDelegate }) {
    return (
        <div className="course-content">
            <main className="course-content-main">
                <CourseActions actions={actions} />
                <CourseResourcesPanel
                    currentUser={currentUser}
                    course={course}
                    resourcesSummary={resourcesSummary}
                    resourcesByWeek={resourcesByWeek}
                    handleUploadResource={handleUploadResource}
                    handleEditResource={handleEditResource}
                    handleToggleResource={handleToggleResource}
                    handleDeleteResource={handleDeleteResource}
                />
            </main>

            <aside className="course-content-aside">
                <CourseInformationPanel
                    currentUser={currentUser}
                    course={course}
                    information={information}
                    delegateCandidates={delegateCandidates}
                    handleRequestDelegate={handleRequestDelegate}
                />
            </aside>
        </div>
    );
}

export default CourseContent;