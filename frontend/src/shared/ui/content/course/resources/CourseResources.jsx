import "./CourseResources.css";
import { FileText } from "lucide-react";

function CourseResources() {
    return (
        <div className="course-resources">
            <div className="course-resources-header">
                <p>RESOURCES BY WEEK</p>
                <span>8 folders - 2 pending</span>
            </div>
            <div className="course-resource">
                <p>Week 1</p>
                <div>
                    <div className="course-resource-files">
                        <div className="course-resource-file">
                            <div className="course-resource-file-info">
                                <span><FileText /></span>
                                <div>
                                    <h4>Syllabus and course rules</h4>
                                    <p>Official PDF · 1.2 MB · 18 Mar</p>
                                    <span>Uploaded by Coordination</span>
                                </div>
                            </div>
                            <p className="course-resource-file-state">View</p>
                        </div>
                        <div className="course-resource-file">
                            <div className="course-resource-file-info">
                                <span><FileText /></span>
                                <div>
                                    <h4>Syllabus and course rules</h4>
                                    <p>Official PDF · 1.2 MB · 18 Mar</p>
                                    <span>Uploaded by Coordination</span>
                                </div>
                            </div>
                            <p className="course-resource-file-state">View</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseResources;
