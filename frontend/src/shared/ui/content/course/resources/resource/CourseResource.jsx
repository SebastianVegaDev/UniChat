import "./CourseResource.css";
import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CourseResourceOptions from "./options/CourseResourceOptions.jsx";

function CourseResource({ currentUser, isUnavailable, resource, handleResourceClick }) {
    const [showOptions, setShowOptions] = useState(false);
    const resourceRef = useRef(null);
    const isTeacher = currentUser?.role === "teacher";

    function handleRightClick(event) {
        event.preventDefault();
        event.stopPropagation();

        setShowOptions(true);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (resourceRef.current && !resourceRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`course-resource-file ${isUnavailable ? "unavailable-file" : "available-file"} ${showOptions ? "options-open" : ""}`}
            onClick={() => handleResourceClick(resource)}
            ref={resourceRef}
            onContextMenu={handleRightClick}
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
            {showOptions && isTeacher && (
                <CourseResourceOptions />
            )}
        </div>
    );
}

export default CourseResource;
