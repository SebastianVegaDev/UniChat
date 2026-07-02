import "./CourseResourceForm.css";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import AppButton from "../../../../shared/ui/primitives/button/AppButton.jsx";
import { formatSelectedFileSize } from "../../helpers/courseResources.js";

function CourseResourceForm({ closeForm, course, resource, handleUploadResource, handleEditResource }) {
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

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const file = formData.get("file");

        if (isEditing) {
            const resourceData = new FormData();

            resourceData.append("resourceId", resource.id);
            resourceData.append("weekNumber", Number(formData.get("weekNumber")));
            resourceData.append("title", formData.get("title"));
            resourceData.append("kind", formData.get("kind"));
            resourceData.append("sizeBytes", Number(formData.get("sizeBytes")));
            resourceData.append("fileUrl", formData.get("fileUrl"));
            resourceData.append("status", formData.get("status"));

            if (file && file.size > 0) {
                resourceData.append("file", file);
            }

            const isSaved = await handleEditResource(resourceData);

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
        <div className="course-resource-form-backdrop" onClick={closeResourceForm}>
            <form className="course-resource-form" onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
                <div className="course-resource-form-header">
                    <div>
                        <p>{isEditing ? resourceTexts.editResource : resourceTexts.addResource}</p>
                        <span>{isEditing ? resourceTexts.editDescription : resourceTexts.addDescription}</span>
                    </div>

                    <button className="course-resource-form-close" type="button" onClick={closeForm}>
                        <X />
                    </button>
                </div>

                <div className="course-resource-form-fields">
                    <input
                        className="course-resource-form-input"
                        name="title"
                        placeholder={resourceTexts.titlePlaceholder}
                        defaultValue={resource?.title ?? ""}
                    />

                    <input
                        className="course-resource-form-input"
                        name="weekNumber"
                        type="number"
                        placeholder={resourceTexts.weekPlaceholder}
                        defaultValue={resource?.weekNumber ?? ""}
                    />

                    <label className="course-resource-form-file">
                        <input
                            className="course-resource-form-file-input"
                            name="file"
                            type="file"
                            ref={fileInputRef}
                            required={!isEditing}
                            onChange={handleFileChange}
                        />

                        <span className="course-resource-form-file-icon">
                            <Upload />
                        </span>

                        <span className="course-resource-form-file-info">
                            <span>{isEditing ? resourceTexts.replaceFile : resourceTexts.uploadFile}</span>
                            <small>{isEditing ? resourceTexts.replaceHelp : resourceTexts.uploadHelp}</small>
                        </span>
                    </label>

                    {selectedFile && (
                        <div className="course-resource-form-file-selected">
                            <div>
                                <span>{selectedFile.name}</span>
                                <small>{formatSelectedFileSize(selectedFile.size)}</small>
                            </div>

                            <button type="button" onClick={clearFile}>
                                <X />
                            </button>
                        </div>
                    )}

                    <input name="sizeBytes" type="hidden" defaultValue={resource?.sizeBytes ?? 0} />
                    <input name="fileUrl" type="hidden" defaultValue={resource?.fileUrl ?? resource?.url ?? ""} />
                    <input name="kind" type="hidden" defaultValue={resource?.kind ?? ""} />

                    <select className="course-resource-form-input" name="status" defaultValue={resource?.status ?? "available"}>
                        <option value="available">{common.available}</option>
                        <option value="unavailable">{common.unavailable}</option>
                    </select>
                </div>

                <div className="course-resource-form-actions">
                    <AppButton variant="secondary" onClick={closeForm}>
                        {common.cancel}
                    </AppButton>

                    <AppButton type="submit">
                        {isEditing ? resourceTexts.saveResource : resourceTexts.addResource}
                    </AppButton>
                </div>
            </form>
        </div>
    );
}

export default CourseResourceForm;