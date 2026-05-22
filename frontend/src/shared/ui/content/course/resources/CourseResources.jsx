import "./CourseResources.css";
import CourseResourcesOptions from "./options/CourseResourcesOptions.jsx";
import CourseResource from "./resource/CourseResource.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const FILE_BASE_URL = API_URL.replace("/api", "");

function CourseResources({ currentUser, course, resourcesSummary, resourcesByWeek, resourcesRef, handleUploadResource, handleEditResource, handleToggleResource, handleDeleteResource }) {

    function handleResourceClick(resource) {
        const isUnavailable = resource.statusLabel === "unavailable";
        const fileUrl = resource.fileUrl || resource.url;

        if (isUnavailable || !fileUrl) return;

        const fullFileUrl = fileUrl.startsWith("http")
            ? fileUrl
            : `${FILE_BASE_URL}${fileUrl}`;

        window.open(fullFileUrl, "_blank", "noopener,noreferrer");
    }

    return (
        <div className="course-resources" ref={resourcesRef}>
            <div className="course-resources-header">
                <p>RESOURCES BY WEEK</p>
                <div>
                    <span className="course-resources-header-folders">{resourcesSummary.foldersCount} folders</span>
                    {currentUser.role === "teacher" && (
                        <CourseResourcesOptions
                            course={course}
                            handleUploadResource={handleUploadResource}
                        />
                    )}
                </div>
            </div>

            {resourcesByWeek.map((resourcesItem) => (
                <div className="course-resource" key={resourcesItem.id}>
                    <p>Week {resourcesItem.weekNumber}</p>

                    <div className="course-resource-files">
                        {resourcesItem.files.map((resource) => {
                            const isUnavailable = resource.statusLabel === "unavailable";

                            return (
                                <CourseResource
                                    key={resource.id}
                                    currentUser={currentUser}
                                    isUnavailable={isUnavailable}
                                    resource={resource}
                                    handleResourceClick={handleResourceClick}
                                    handleEditResource={handleEditResource}
                                    handleToggleResource={handleToggleResource}
                                    handleDeleteResource={handleDeleteResource}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CourseResources;
