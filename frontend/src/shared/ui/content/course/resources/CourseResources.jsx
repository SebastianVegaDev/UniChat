import "./CourseResources.css";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CourseResources({ resourcesSummary, resourcesByWeek }) {
    const navigate = useNavigate();

    function handleResourceClick(resource) {
        const isUnavailable = resource.statusLabel === "unavailable";

        if (isUnavailable) return;

        navigate(resource.url);
    }

    return (
        <div className="course-resources">
            <div className="course-resources-header">
                <p>RESOURCES BY WEEK</p>
                <span>{resourcesSummary.foldersCount} folders</span>
            </div>

            {resourcesByWeek.map((resourcesItem) => (
                <div className="course-resource" key={resourcesItem.id}>
                    <p>Week {resourcesItem.weekNumber}</p>

                    <div className="course-resource-files">
                        {resourcesItem.files.map((resource) => {
                            const isUnavailable = resource.statusLabel === "unavailable";

                            return (
                                <div
                                    className={`course-resource-file ${isUnavailable ? "unavailable-file" : "available-file"}`}
                                    key={resource.id}
                                    onClick={() => handleResourceClick(resource)}
                                >
                                    <div className="course-resource-file-info">
                                        <span>
                                            <FileText />
                                        </span>

                                        <div>
                                            <h4>{resource.title}</h4>
                                            <p>
                                                {resource.kindLabel} · {resource.sizeLabel} · {resource.dateLabel}
                                            </p>
                                            <span>Uploaded by {resource.uploadedBy}</span>
                                        </div>
                                    </div>

                                    <p className={`course-resource-file-state ${isUnavailable ? "unavailable" : "available"}`}>
                                        {resource.statusLabel}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CourseResources;