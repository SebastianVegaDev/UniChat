import "./CreateForm.css";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { usePreferenceTexts } from "../../../../feature/preferences/context/PreferencesContext.js";

function ResourceForm({ closeForm, course, resource, handleUploadResource, handleEditResource }) {
    const isEditing = Boolean(resource);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const { common, forms } = usePreferenceTexts();
    const resourceTexts = forms.resource;

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
                        <p>{isEditing ? resourceTexts.editResource : resourceTexts.addResource}</p>
                        <span>{isEditing ? resourceTexts.editDescription : resourceTexts.addDescription}</span>
                    </div>
                    <button className="create-form-close" type="button" onClick={closeForm}>
                        <X />
                    </button>
                </div>

                <div className="create-form-fields">
                    <input className="create-form-input" name="title" placeholder={resourceTexts.titlePlaceholder} defaultValue={resource?.title ?? ""} />
                    <input className="create-form-input" name="weekNumber" type="number" placeholder={resourceTexts.weekPlaceholder} defaultValue={resource?.weekNumber ?? ""} />

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
                            <span>{isEditing ? resourceTexts.replaceFile : resourceTexts.uploadFile}</span>
                            <small>{isEditing ? resourceTexts.replaceHelp : resourceTexts.uploadHelp}</small>
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
                        <option value="available">{common.available}</option>
                        <option value="unavailable">{common.unavailable}</option>
                    </select>
                </div>

                <div className="create-form-actions">
                    <button className="create-form-cancel" type="button" onClick={closeForm}>{common.cancel}</button>
                    <button className="create-form-submit" type="submit">{isEditing ? resourceTexts.saveResource : resourceTexts.addResource}</button>
                </div>
            </form>
        </div>
    );
}

export default ResourceForm;
