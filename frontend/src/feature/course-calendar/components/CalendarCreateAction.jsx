import "./CalendarCreateAction.css";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import AppButton from "../../../shared/ui/primitives/button/AppButton.jsx";
import CalendarEventForm from "./CalendarEventForm.jsx";

function CalendarCreateAction({ course, handleCreateEvent }) {
    const [isCreating, setIsCreating] = useState(false);
    const { calendar } = usePreferenceTexts();

    return (
        <>
            <div className="calendar-create-action">
                <AppButton icon={CalendarPlus} size="sm" variant="soft" onClick={() => setIsCreating(true)}>
                    {calendar.createEvent}
                </AppButton>
            </div>

            {isCreating && (
                <CalendarEventForm
                    closeForm={() => setIsCreating(false)}
                    course={course}
                    handleCreateEvent={handleCreateEvent}
                />
            )}
        </>
    );
}

export default CalendarCreateAction;