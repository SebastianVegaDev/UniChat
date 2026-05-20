import "./CourseResourcesOptions.css";
import { Ellipsis } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function CourseResourcesOptions() {
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <div ref={optionsRef} className="course-resources-options-wrapper">
            <button
                className="course-resources-options-trigger"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Ellipsis />
            </button>

            <div className="course-resources-options" hidden={!isOpen}>
                <p className="course-resources-option">Add Resource</p>
                <p className="course-resources-option">Toggle availability</p>
            </div>
        </div>
    );
}

export default CourseResourcesOptions;