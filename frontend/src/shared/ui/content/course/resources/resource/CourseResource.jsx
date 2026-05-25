import "./CourseResource.css";
import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CourseResourceOptions from "./options/CourseResourceOptions.jsx";
import ResourceForm from "../../../../forms/create/ResourceForm.jsx";
import { usePreferenceTexts } from "../../../../../../feature/preferences/context/PreferencesContext.js";

function CourseResource({ currentUser, isUnavailable, resource, handleResourceClick, handleEditResource, handleToggleResource, handleDeleteResource }) {
    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const resourceRef = useRef(null);
    const isTeacher = currentUser?.role === "teacher";
    const { course } = usePreferenceTexts();

    function handleRightClick(event) {
        event.preventDefault();
        event.stopPropagation();

        setShowOptions(true);
    }

    function openEditForm() {
        setIsEditing(true);
        setShowOptions(false);
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
            className={`course-resource-file ${isUnavailable ? "unavailable-file" : "available-file"} ${showOptions ? "options-open" : ""} ${isEditing ? "editing-file" : ""}`}
            onClick={() => !isEditing && handleResourceClick(resource)}
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
                    <span>{course.uploadedBy} {resource.uploadedBy}</span>
                </div>
            </div>

            <p className={`course-resource-file-state ${isUnavailable ? "unavailable" : "available"}`}>
                {resource.statusText}
            </p>
            {showOptions && isTeacher && (
                <CourseResourceOptions
                    resource={resource}
                    closeOptions={() => setShowOptions(false)}
                    openEditForm={openEditForm}
                    handleToggleResource={handleToggleResource}
                    handleDeleteResource={handleDeleteResource}
                />
            )}

            {isEditing && (
                <ResourceForm
                    closeForm={() => setIsEditing(false)}
                    course={{ id: resource.courseId }}
                    resource={resource}
                    handleEditResource={handleEditResource}
                />
            )}
        </div>
    );
}

export default CourseResource;
