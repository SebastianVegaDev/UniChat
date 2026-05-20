import "./CalendarCreateOptions.css";
import { CalendarPlus } from "lucide-react";
import CreateForm from "../../../../forms/create/CreateForm.jsx";
import { useState, useEffect, useRef } from "react";

function CalendarCreateOptions({ course, handleCreateEvent }) {
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
        <div ref={optionsRef} className="calendar-create-options-wrapper">
            <button 
                className="calendar-create-options" 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <CalendarPlus />
                Create event
            </button>
            <div className="calendar-create-form" hidden={!isOpen}>
                <CreateForm
                    closeForm={() => setIsOpen(false)}
                    course={course}
                    handleCreateEvent={handleCreateEvent}
                />
            </div>
        </div>
    );
}

export default CalendarCreateOptions;
