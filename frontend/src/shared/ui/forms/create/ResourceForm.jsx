import "./CreateForm.css";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

function ResourceForm({ closeForm, course, resource, handleUploadResource, handleEditResource }) {
    const isEditing = Boolean(resource);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    function closeResourceForm(event) {
        event.stopPropagation();
        closeForm();
    }

    function handleFileChange(event) {
        setSelectedFile(event.target.files[0] ?? null);
    }

    function clearFile() {
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function formatFileSize(size) {
        return `${(size / 1000000).toFixed(1)} MB`;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const file = formData.get("file");

        if (isEditing) {
            const resourceData = new FormData()

            resourceData.append("resourceId", resource.id);
            resourceData.append("weekNumber", Number(formData.get("weekNumber")));
            resourceData.append("title", formData.get("title"))
            resourceData.append("kind", formData.get("kind"))
            resourceData.append("sizeBytes", Number(formData.get("sizeBytes")))
            resourceData.append("fileUrl", formData.get("fileUrl"))
            resourceData.append("status", formData.get("status"))

            if (file && file.size > 0) {
                resourceData.append("file", file);
            }

            const isSaved = await handleEditResource(resourceData)

            if (isSaved) closeForm();

            return;
        }

        const resourceData = new FormData();

        resourceData.append("courseId", course.id);
        resourceData.append("weekNumber", formData.get("weekNumber"));
        resourceData.append("title", formData.get("title"));
        resourceData.append("status", formData.get("status"));
        resourceData.append("file", file);

        const isSaved = await handleUploadResource(resourceData);

        if (isSaved) closeForm();
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

                    <label className="create-form-file">
                        <input
                            className="create-form-file-input"
                            name="file"
                            type="file"
                            ref={fileInputRef}
                            required={!isEditing}
                            onChange={handleFileChange}
                        />
                        <span className="create-form-file-icon">
                            <Upload />
                        </span>
                        <span className="create-form-file-info">
                            <span>{isEditing ? "Replace file" : "Upload file"}</span>
                            <small>{isEditing ? "Choose a new file if needed." : "Choose the resource file from your device."}</small>
                        </span>
                    </label>

                    {selectedFile ? (
                        <div className="create-form-file-selected">
                            <div>
                                <span>{selectedFile.name}</span>
                                <small>{formatFileSize(selectedFile.size)}</small>
                            </div>
                            <button type="button" onClick={clearFile}>
                                <X />
                            </button>
                        </div>
                    ) : null}

                    <input name="sizeBytes" type="hidden" defaultValue={resource?.sizeBytes ?? 0} />
                    <input name="fileUrl" type="hidden" defaultValue={resource?.fileUrl ?? resource?.url ?? ""} />
                    <input name="kind" type="hidden" defaultValue={resource?.kind ?? ""} />

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
