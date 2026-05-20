import "./CreateForm.css";
import { X } from "lucide-react";

function CreateForm({ closeForm }) {
    function handleSubmit(event) {
        event.preventDefault();
        closeForm();
    }

    return (
        <div className="create-form-backdrop" onClick={closeForm}>
            <form className="create-form" onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
                <div className="create-form-header">
                    <div>
                        <p>Create event</p>
                        <span>Add a new activity to this course calendar.</span>
                    </div>
                    <button className="create-form-close" type="button" onClick={closeForm}>
                        <X />
                    </button>
                </div>

                <div className="create-form-fields">
                    <input className="create-form-input" name="title" placeholder="Title" />
                    <textarea className="create-form-input create-form-textarea" name="description" placeholder="Description" />

                    <select className="create-form-input" name="type" defaultValue="">
                        <option value="" disabled>Type</option>
                        <option value="assignment">Assignment</option>
                        <option value="exam">Exam</option>
                        <option value="reminder">Reminder</option>
                        <option value="announcement">Announcement</option>
                        <option value="other">Other</option>
                    </select>

                    <div className="create-form-dates">
                        <input className="create-form-input" name="startsAt" type="datetime-local" />
                        <input className="create-form-input" name="endsAt" type="datetime-local" />
                    </div>
                </div>

                <div className="create-form-actions">
                    <button className="create-form-cancel" type="button" onClick={closeForm}>Cancel</button>
                    <button className="create-form-submit" type="submit">Create event</button>
                </div>
            </form>
        </div>
    );
}

export default CreateForm;
