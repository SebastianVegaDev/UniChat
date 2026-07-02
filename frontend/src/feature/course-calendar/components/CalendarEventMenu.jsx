import "./CalendarEventMenu.css";
import { useState } from "react";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import FloatingMenu, { FloatingMenuButton } from "../../../shared/ui/primitives/menu/FloatingMenu.jsx";
import CalendarEventForm from "./CalendarEventForm.jsx";

function CalendarEventMenu({ eventOptionsRef, position, course, closeOptions, handleEditEvent, handleCancelEvent, handleDeleteEvent }) {
    const [isEditing, setIsEditing] = useState(false);
    const { common } = usePreferenceTexts();

    function editEvent() {
        setIsEditing(true);
    }

    function cancelEvent() {
        handleCancelEvent({
            calendarEventId: position.id
        });

        closeOptions();
    }

    function deleteEvent() {
        handleDeleteEvent({
            calendarEventId: position.id
        });

        closeOptions();
    }

    return (
        <>
            <FloatingMenu
                className="calendar-event-menu"
                menuRef={eventOptionsRef}
                style={{
                    top: position.y,
                    left: position.x
                }}
            >
                <FloatingMenuButton onClick={editEvent}>
                    {common.edit}
                </FloatingMenuButton>

                <FloatingMenuButton onClick={cancelEvent}>
                    {common.cancel}
                </FloatingMenuButton>

                <FloatingMenuButton variant="danger" onClick={deleteEvent}>
                    {common.delete}
                </FloatingMenuButton>
            </FloatingMenu>

            {isEditing && (
                <CalendarEventForm
                    closeForm={() => {
                        setIsEditing(false);
                        closeOptions();
                    }}
                    course={course}
                    calendarEvent={position.event}
                    handleEditEvent={handleEditEvent}
                />
            )}
        </>
    );
}

export default CalendarEventMenu;