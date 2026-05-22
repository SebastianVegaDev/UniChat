import "./CourseResourcesOptions.css";
import { Ellipsis } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ResourceForm from "../../../../forms/create/ResourceForm.jsx";

function CourseResourcesOptions({ course, handleUploadResource }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const optionsRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function openCreateForm() {
        setIsCreating(true);
        setIsOpen(false);
    }

    return (
        <>
            <div ref={optionsRef} className="course-resources-options-wrapper">
                <button
                    className="course-resources-options-trigger"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Ellipsis />
                </button>

                <div className="course-resources-options" hidden={!isOpen}>
                    <p className="course-resources-option" onClick={openCreateForm}>Add Resource</p>
                </div>
            </div>

            {isCreating && (
                <ResourceForm
                    closeForm={() => setIsCreating(false)}
                    course={course}
                    handleUploadResource={handleUploadResource}
                />
            )}
        </>
    );
}

export default CourseResourcesOptions;
