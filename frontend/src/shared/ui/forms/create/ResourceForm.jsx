import "./CreateForm.css";
import { X } from "lucide-react";

function ResourceForm({ closeForm, course, resource, handleUploadResource, handleEditResource }) {
    const isEditing = Boolean(resource);

    function closeResourceForm(event) {
        event.stopPropagation();
        closeForm();
    }

    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const resourceData = {
            courseId: course.id,
            weekNumber: Number(formData.get("weekNumber")),
            title: formData.get("title"),
            kind: formData.get("kind"),
            sizeBytes: Number(formData.get("sizeBytes")),
            fileUrl: formData.get("fileUrl"),
            status: formData.get("status")
        };

        if (isEditing) {
            handleEditResource({
                ...resourceData,
                resourceId: resource.id
            });
        } else {
            handleUploadResource(resourceData);
        }

        closeForm();
    }

    return (
        <div className="create-form-backdrop" onClick={closeResourceForm}>
            <form className="create-form" onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
                <div className="create-form-header">
                    <div>
                        <p>{isEditing ? "Edit resource" : "Add resource"}</p>
                        <span>{isEditing ? "Update this course resource." : "Add a new resource to this course."}</span>
                    </div>
                    <button className="create-form-close" type="button" onClick={closeForm}>
                        <X />
                    </button>
                </div>

                <div className="create-form-fields">
                    <input className="create-form-input" name="title" placeholder="Title" defaultValue={resource?.title ?? ""} />
                    <input className="create-form-input" name="weekNumber" type="number" placeholder="Week" defaultValue={resource?.weekNumber ?? ""} />

                    <select className="create-form-input" name="kind" defaultValue={resource?.kind ?? ""}>
                        <option value="" disabled>Kind</option>
                        <option value="pdf">PDF</option>
                        <option value="ppt">PowerPoint</option>
                        <option value="video">Video</option>
                        <option value="photo">Photo</option>
                        <option value="sql">SQL</option>
                    </select>

                    <input className="create-form-input" name="sizeBytes" type="number" placeholder="Size bytes" defaultValue={resource?.sizeBytes ?? ""} />
                    <input className="create-form-input" name="fileUrl" placeholder="File URL" defaultValue={resource?.fileUrl ?? resource?.url ?? ""} />

                    <select className="create-form-input" name="status" defaultValue={resource?.status ?? "available"}>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>

                <div className="create-form-actions">
                    <button className="create-form-cancel" type="button" onClick={closeForm}>Cancel</button>
                    <button className="create-form-submit" type="submit">{isEditing ? "Save resource" : "Add resource"}</button>
                </div>
            </form>
        </div>
    );
}

export default ResourceForm;
