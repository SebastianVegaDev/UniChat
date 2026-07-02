import "./CourseResourceForm.css";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import AppButton from "../../../../shared/ui/primitives/button/AppButton.jsx";
import { formatSelectedFileSize } from "../../helpers/courseResources.js";
import type { AsyncFormHandler, Course, CourseResource } from "../../../../shared/types/app.types.js";

interface CourseResourceFormProps {
    closeForm: () => void;
    course: Pick<Course, "id">;
    resource?: CourseResource | null;
    handleUploadResource?: AsyncFormHandler;
    handleEditResource?: AsyncFormHandler;
}

function getRequiredFormString(formData: FormData, name: string): string {
    const value = formData.get(name);

    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`${name} is required`);
    }

    return value;
}

function getOptionalFormString(formData: FormData, name: string): string {
    const value = formData.get(name);

    return typeof value === "string" ? value : "";
}

function CourseResourceForm({
    closeForm,
    course,
    resource,
    handleUploadResource,
    handleEditResource
}: CourseResourceFormProps) {
    const isEditing = Boolean(resource);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { common, forms } = usePreferenceTexts();
    const resourceTexts = forms.resource;

    function closeResourceForm(event: MouseEvent<HTMLDivElement>): void {
        event.stopPropagation();
        closeForm();
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        setSelectedFile(event.target.files?.[0] ?? null);
    }

    function clearFile(): void {
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const file = formData.get("file");

        if (resource) {
            const resourceData = new FormData();

            resourceData.append("resourceId", String(resource.id));
            resourceData.append("weekNumber", getRequiredFormString(formData, "weekNumber"));
            resourceData.append("title", getRequiredFormString(formData, "title"));
            resourceData.append("kind", getOptionalFormString(formData, "kind"));
            resourceData.append("sizeBytes", getOptionalFormString(formData, "sizeBytes"));
            resourceData.append("fileUrl", getOptionalFormString(formData, "fileUrl"));
            resourceData.append("status", getRequiredFormString(formData, "status"));

            if (file instanceof File && file.size > 0) {
                resourceData.append("file", file);
            }

            const isSaved = await handleEditResource?.(resourceData);

            if (isSaved) closeForm();

            return;
        }

        const resourceData = new FormData();

        resourceData.append("courseId", String(course.id));
        resourceData.append("weekNumber", getRequiredFormString(formData, "weekNumber"));
        resourceData.append("title", getRequiredFormString(formData, "title"));
        resourceData.append("status", getRequiredFormString(formData, "status"));

        if (file instanceof File) {
            resourceData.append("file", file);
        }

        const isSaved = await handleUploadResource?.(resourceData);

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
