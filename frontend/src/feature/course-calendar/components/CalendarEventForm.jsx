import "./CalendarEventForm.css";
import { X } from "lucide-react";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import AppButton from "../../../shared/ui/primitives/button/AppButton.jsx";
import { formatDateTimeInput, getCalendarEventFormData } from "../helpers/calendarForms.js";

function CalendarEventForm({ closeForm, course, calendarEvent, handleCreateEvent, handleEditEvent }) {
    const isEditing = Boolean(calendarEvent);
    const { calendar, common } = usePreferenceTexts();

    async function handleSubmit(event) {
        event.preventDefault();

        const calendarEventData = getCalendarEventFormData(event, course, calendarEvent);

        const isSaved = isEditing
            ? await handleEditEvent(calendarEventData)
            : await handleCreateEvent(calendarEventData);

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
                        defaultValue={calendarEvent?.title ?? ""}
                    />

                    <textarea
                        className="calendar-event-form-input calendar-event-form-textarea"
                        name="description"
                        placeholder={calendar.descriptionPlaceholder}
                        defaultValue={calendarEvent?.description ?? ""}
                    />

                    <select
                        className="calendar-event-form-input"
                        name="eventType"
                        defaultValue={calendarEvent?.eventType ?? ""}
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
                            defaultValue={formatDateTimeInput(calendarEvent?.startsAt)}
                        />

                        <input
                            className="calendar-event-form-input"
                            name="endsAt"
                            type="datetime-local"
                            defaultValue={formatDateTimeInput(calendarEvent?.endsAt)}
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