import "./PreferencesForm.css";
import { useState } from "react";
import AppButton from "../../../shared/ui/primitives/button/AppButton.jsx";
import PreferencesField from "./PreferencesField.jsx";
import { getPreferencesFormValues } from "../helpers/preferencesFormValues.js";

function PreferencesForm({ preferences, handleSubmitPreferences }) {
    const [values, setValues] = useState(() => getPreferencesFormValues(preferences));

    function updateValue(name, value) {
        setValues((currentValues) => ({
            ...currentValues,
            [name]: value
        }));
    }

    function updateWallpaper(file, shouldRemove) {
        setValues((currentValues) => ({
            ...currentValues,
            chatWallpaperName: file?.name ?? "",
            chatWallpaperUrl: "",
            chatWallpaperFile: file ?? null,
            removeChatWallpaper: shouldRemove
        }));
    }

    function resetValues() {
        setValues(getPreferencesFormValues(preferences));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        await handleSubmitPreferences(values);
    }

    return (
        <form className="preferences-form" onSubmit={handleSubmit}>
            <div className="preferences-form-header">
                <p>{preferences.title}</p>
            </div>

            <div className="preferences-form-fields">
                {preferences.sections.map((section) => (
                    <section className="preferences-form-section" key={section.id}>
                        <h2>{section.title}</h2>

                        {section.fields.map((field) => (
                            <PreferencesField
                                field={field}
                                key={field.id}
                                values={values}
                                updateValue={updateValue}
                                updateWallpaper={updateWallpaper}
                            />
                        ))}
                    </section>
                ))}
            </div>

            <div className="preferences-form-actions">
                <AppButton variant="secondary" onClick={resetValues}>
                    {preferences.actions.reset}
                </AppButton>

                <AppButton type="submit">
                    {preferences.actions.save}
                </AppButton>
            </div>
        </form>
    );
}

export default PreferencesForm;