import "./CourseResourceCreateMenu.css";
import { Ellipsis } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import CourseResourceForm from "./CourseResourceForm.jsx";

function CourseResourceCreateMenu({ course, handleUploadResource }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const menuRef = useRef(null);
    const { course: courseTexts } = usePreferenceTexts();

    function openCreateForm() {
        setIsCreating(true);
        setIsOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div ref={menuRef} className="course-resource-create-menu-wrapper">
                <button
                    className="course-resource-create-menu-trigger"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Ellipsis />
                </button>

                {isOpen && (
                    <div className="course-resource-create-menu">
                        <button type="button" onClick={openCreateForm}>
                            {courseTexts.addResource}
                        </button>
                    </div>
                )}
            </div>

            {isCreating && (
                <CourseResourceForm
                    closeForm={() => setIsCreating(false)}
                    course={course}
                    handleUploadResource={handleUploadResource}
                />
            )}
        </>
    );
}

export default CourseResourceCreateMenu;