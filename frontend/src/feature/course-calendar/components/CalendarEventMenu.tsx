import "./CalendarEventMenu.css";
import { useState } from "react";
import type { RefObject } from "react";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import FloatingMenu, { FloatingMenuButton } from "../../../shared/ui/primitives/menu/FloatingMenu.jsx";
import CalendarEventForm from "./CalendarEventForm.jsx";
import type { Course, Dictionary } from "../../../shared/types/app.types.js";

interface CalendarMenuPosition {
    id: string;
    event: Dictionary;
    x: number;
    y: number;
}

interface CalendarEventMenuProps {
    eventOptionsRef: RefObject<HTMLDivElement | null>;
    position: CalendarMenuPosition;
    course: Course;
    closeOptions: () => void;
    handleEditEvent: (payload: Dictionary) => Promise<boolean>;
    handleCancelEvent: (payload: Dictionary) => Promise<boolean>;
    handleDeleteEvent: (payload: Dictionary) => Promise<boolean>;
}

function CalendarEventMenu({
    eventOptionsRef,
    position,
    course,
    closeOptions,
    handleEditEvent,
    handleCancelEvent,
    handleDeleteEvent
}: CalendarEventMenuProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { common } = usePreferenceTexts();

    function editEvent(): void {
        setIsEditing(true);
    }

    function cancelEvent(): void {
        handleCancelEvent({
            calendarEventId: position.id
        });

        closeOptions();
    }

    function deleteEvent(): void {
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
