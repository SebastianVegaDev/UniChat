import "./CreateForm.css";
import { X } from "lucide-react";
import { usePreferenceTexts } from "../../../../feature/preferences/context/PreferencesContext.js";

function formatDateInput(dateValue) {
    if (!dateValue) return "";

    return dateValue.slice(0, 16);
}

function CreateForm({ closeForm, course, calendarEvent, handleCreateEvent, handleEditEvent }) {
    const isEditing = Boolean(calendarEvent);
    const { calendar, common } = usePreferenceTexts();

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const calendarEventData = {
            courseId: course.id,
            title: formData.get("title"),
            description: formData.get("description"),
            eventType: formData.get("eventType"),
            startsAt: formData.get("startsAt"),
            endsAt: formData.get("endsAt")
        };

        const isSaved = isEditing
            ? await handleEditEvent({
                ...calendarEventData,
                calendarEventId: calendarEvent.id
            })
            : await handleCreateEvent(calendarEventData);

        if (isSaved) closeForm();
    }

    return (
        <div className="create-form-backdrop" onClick={closeForm}>
            <form className="create-form" onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
                <div className="create-form-header">
                    <div>
                        <p>{isEditing ? calendar.editEvent : calendar.createEvent}</p>
                        <span>{isEditing ? calendar.editDescription : calendar.createDescription}</span>
                    </div>
                    <button className="create-form-close" type="button" onClick={closeForm}>
                        <X />
                    </button>
                </div>

                <div className="create-form-fields">
                    <input className="create-form-input" name="title" placeholder={calendar.titlePlaceholder} defaultValue={calendarEvent?.title ?? ""} />
                    <textarea className="create-form-input create-form-textarea" name="description" placeholder={calendar.descriptionPlaceholder} defaultValue={calendarEvent?.description ?? ""} />

                    <select className="create-form-input" name="eventType" defaultValue={calendarEvent?.eventType ?? ""}>
                        <option value="" disabled>{calendar.type}</option>
                        <option value="assignment">{calendar.eventTypes.assignment}</option>
                        <option value="exam">{calendar.eventTypes.exam}</option>
                        <option value="reminder">{calendar.eventTypes.reminder}</option>
                        <option value="announcement">{calendar.eventTypes.announcement}</option>
                        <option value="other">{calendar.eventTypes.other}</option>
                    </select>

                    <div className="create-form-dates">
                        <input className="create-form-input" name="startsAt" type="datetime-local" defaultValue={formatDateInput(calendarEvent?.startsAt)} />
                        <input className="create-form-input" name="endsAt" type="datetime-local" defaultValue={formatDateInput(calendarEvent?.endsAt)} />
                    </div>
                </div>

                <div className="create-form-actions">
                    <button className="create-form-cancel" type="button" onClick={closeForm}>{common.cancel}</button>
                    <button className="create-form-submit" type="submit">{isEditing ? calendar.saveEvent : calendar.createEvent}</button>
                </div>
            </form>
        </div>
    );
}

export default CreateForm;
