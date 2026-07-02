import "./CalendarEventForm.css";
import { X } from "lucide-react";
import type { FormEvent } from "react";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import AppButton from "../../../shared/ui/primitives/button/AppButton.jsx";
import { formatDateTimeInput, getCalendarEventFormData } from "../helpers/calendarForms.js";
import type { Course, Dictionary } from "../../../shared/types/app.types.js";

interface CalendarEventFormProps {
    closeForm: () => void;
    course: Course;
    calendarEvent?: Dictionary;
    handleCreateEvent?: (payload: Dictionary) => Promise<boolean>;
    handleEditEvent?: (payload: Dictionary) => Promise<boolean>;
}

function CalendarEventForm({
    closeForm,
    course,
    calendarEvent,
    handleCreateEvent,
    handleEditEvent
}: CalendarEventFormProps) {
    const isEditing = Boolean(calendarEvent);
    const { calendar, common } = usePreferenceTexts();
    const title = typeof calendarEvent?.title === "string" ? calendarEvent.title : "";
    const description = typeof calendarEvent?.description === "string" ? calendarEvent.description : "";
    const eventType = typeof calendarEvent?.eventType === "string" ? calendarEvent.eventType : "";
    const startsAt = typeof calendarEvent?.startsAt === "string" ? calendarEvent.startsAt : undefined;
    const endsAt = typeof calendarEvent?.endsAt === "string" ? calendarEvent.endsAt : undefined;

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const calendarEventData = getCalendarEventFormData(event, course, calendarEvent);

        const isSaved = isEditing
            ? await handleEditEvent?.(calendarEventData)
            : await handleCreateEvent?.(calendarEventData);

        if (isSaved) closeForm();
    }

    return (
        <div className="calendar-event-form-backdrop" onClick={closeForm}>
            <form className="calendar-event-form" onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
                <div className="calendar-event-form-header">
                    <div>
                        <p>{isEditing ? calendar.editEvent : calendar.createEvent}</p>
                        <span>{isEditing ? calendar.editDescription : calendar.createDescription}</span>
                    </div>

                    <button className="calendar-event-form-close" type="button" onClick={closeForm}>
                        <X />
                    </button>
                </div>

                <div className="calendar-event-form-fields">
                    <input
                        className="calendar-event-form-input"
                        name="title"
                        placeholder={calendar.titlePlaceholder}
                        defaultValue={title}
                    />

                    <textarea
                        className="calendar-event-form-input calendar-event-form-textarea"
                        name="description"
                        placeholder={calendar.descriptionPlaceholder}
                        defaultValue={description}
                    />

                    <select
                        className="calendar-event-form-input"
                        name="eventType"
                        defaultValue={eventType}
                    >
                        <option value="" disabled>{calendar.type}</option>
                        <option value="assignment">{calendar.eventTypes.assignment}</option>
                        <option value="exam">{calendar.eventTypes.exam}</option>
                        <option value="reminder">{calendar.eventTypes.reminder}</option>
                        <option value="announcement">{calendar.eventTypes.announcement}</option>
                        <option value="other">{calendar.eventTypes.other}</option>
                    </select>

                    <div className="calendar-event-form-dates">
                        <input
                            className="calendar-event-form-input"
                            name="startsAt"
                            type="datetime-local"
                            defaultValue={formatDateTimeInput(startsAt)}
                        />

                        <input
                            className="calendar-event-form-input"
                            name="endsAt"
                            type="datetime-local"
                            defaultValue={formatDateTimeInput(endsAt)}
                        />
                    </div>
                </div>

                <div className="calendar-event-form-actions">
                    <AppButton variant="secondary" onClick={closeForm}>
                        {common.cancel}
                    </AppButton>

                    <AppButton type="submit">
                        {isEditing ? calendar.saveEvent : calendar.createEvent}
                    </AppButton>
                </div>
            </form>
        </div>
    );
}

export default CalendarEventForm;
