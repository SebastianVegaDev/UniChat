import "./CourseResourceCard.css";
import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import StatusPill from "../../../../shared/ui/primitives/status/StatusPill.jsx";
import { isResourceUnavailable } from "../../helpers/courseResources.js";
import CourseResourceForm from "./CourseResourceForm.jsx";
import CourseResourceMenu from "./CourseResourceMenu.jsx";

function CourseResourceCard({ currentUser, resource, handleResourceClick, handleEditResource, handleToggleResource, handleDeleteResource }) {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const resourceRef = useRef(null);
    const isTeacher = currentUser?.role === "teacher";
    const unavailable = isResourceUnavailable(resource);
    const { course } = usePreferenceTexts();

    function handleRightClick(event) {
        if (!isTeacher) return;

        event.preventDefault();
        event.stopPropagation();
        setShowMenu(true);
    }

    function openEditForm() {
        setIsEditing(true);
        setShowMenu(false);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (resourceRef.current && !resourceRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <article
            className={`course-resource-card ${unavailable ? "unavailable" : "available"} ${showMenu ? "menu-open" : ""} ${isEditing ? "editing" : ""}`}
            ref={resourceRef}
            onClick={() => !isEditing && handleResourceClick(resource)}
            onContextMenu={handleRightClick}
        >
            <div className="course-resource-card-info">
                <span className="course-resource-card-icon">
                    <FileText />
                </span>

                <div>
                    <h4>{resource.title}</h4>
                    <p>{resource.kindLabel} · {resource.sizeLabel} · {resource.dateLabel}</p>
                    <span>{course.uploadedBy} {resource.uploadedBy}</span>
                </div>
            </div>

            <StatusPill type={unavailable ? "inactive" : "active"}>
                {resource.statusText}
            </StatusPill>

            {showMenu && isTeacher && (
                <CourseResourceMenu
                    resource={resource}
                    closeMenu={() => setShowMenu(false)}
                    openEditForm={openEditForm}
                    handleToggleResource={handleToggleResource}
                    handleDeleteResource={handleDeleteResource}
                />
            )}

            {isEditing && (
                <CourseResourceForm
                    closeForm={() => setIsEditing(false)}
                    course={{ id: resource.courseId }}
                    resource={resource}
                    handleEditResource={handleEditResource}
                />
            )}
        </article>
    );
}

export default CourseResourceCard;