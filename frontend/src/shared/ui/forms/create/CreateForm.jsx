import "./CreateForm.css";
import { X } from "lucide-react";

function formatDateInput(dateValue) {
    if (!dateValue) return "";

    return dateValue.slice(0, 16);
}

function CreateForm({ closeForm, course, calendarEvent, handleCreateEvent, handleEditEvent }) {
    const isEditing = Boolean(calendarEvent);

    function handleSubmit(event) {
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

        if (isEditing) {
            handleEditEvent({
                ...calendarEventData,
                calendarEventId: calendarEvent.id
            });
        } else {
            handleCreateEvent(calendarEventData);
        }

        closeForm();
    }

    return (
        <div className="create-form-backdrop" onClick={closeForm}>
            <form className="create-form" onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
                <div className="create-form-header">
                    <div>
                        <p>{isEditing ? "Edit event" : "Create event"}</p>
                        <span>{isEditing ? "Update this course calendar activity." : "Add a new activity to this course calendar."}</span>
                    </div>
                    <button className="create-form-close" type="button" onClick={closeForm}>
                        <X />
                    </button>
                </div>

                <div className="create-form-fields">
                    <input className="create-form-input" name="title" placeholder="Title" defaultValue={calendarEvent?.title ?? ""} />
                    <textarea className="create-form-input create-form-textarea" name="description" placeholder="Description" defaultValue={calendarEvent?.description ?? ""} />

                    <select className="create-form-input" name="eventType" defaultValue={calendarEvent?.eventType ?? ""}>
                        <option value="" disabled>Type</option>
                        <option value="assignment">Assignment</option>
                        <option value="exam">Exam</option>
                        <option value="reminder">Reminder</option>
                        <option value="announcement">Announcement</option>
                        <option value="other">Other</option>
                    </select>

                    <div className="create-form-dates">
                        <input className="create-form-input" name="startsAt" type="datetime-local" defaultValue={formatDateInput(calendarEvent?.startsAt)} />
                        <input className="create-form-input" name="endsAt" type="datetime-local" defaultValue={formatDateInput(calendarEvent?.endsAt)} />
                    </div>
                </div>

                <div className="create-form-actions">
                    <button className="create-form-cancel" type="button" onClick={closeForm}>Cancel</button>
                    <button className="create-form-submit" type="submit">{isEditing ? "Save event" : "Create event"}</button>
                </div>
            </form>
        </div>
    );
}

export default CreateForm;
