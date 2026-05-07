import "./CourseResources.css";
import { FileText } from "lucide-react";
import { NavLink } from "react-router-dom"

function CourseResources({ resourcesSummary, resourcesByWeek }) {
    return (
        <div className="course-resources">
            <div className="course-resources-header">
                <p>RESOURCES BY WEEK</p>
                <span>{resourcesSummary.foldersCount} folders - {resourcesSummary.pendingCount} pending</span>
            </div>
            { resourcesByWeek.map((resourcesItem) => (
                <div className="course-resource" key={resourcesItem.id}>
                    <p>Week {resourcesItem.weekNumber}</p>
                    <div>
                        <div className="course-resource-files">
                            { resourcesItem.files.map((resource) => (
                                <NavLink to={resource.url} className="course-resource-file" key={resource.id}>
                                    <div className="course-resource-file-info">
                                        <span><FileText /></span>
                                        <div>
                                            <h4>{resource.title}</h4>
                                            <p>{resource.kindLabel} · {resource.sizeLabel} · {resource.dateLabel}</p>
                                            <span>Uploaded by {resource.uploadedBy}</span>
                                        </div>
                                    </div>
                                    <p className="course-resource-file-state">{resource.statusLabel}</p>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CourseResources;
