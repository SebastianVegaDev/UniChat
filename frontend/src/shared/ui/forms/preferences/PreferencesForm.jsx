import "./PreferencesForm.css";
import { Image, Upload } from "lucide-react";
import { useState } from "react";

function findPreferenceField(preferences, fieldId) {
    return preferences.sections
        .flatMap((section) => section.fields)
        .find((field) => field.id === fieldId);
}

function getPreferencesFormValues(preferences) {
    return {
        language: findPreferenceField(preferences, "language")?.value ?? "English",
        chatWallpaperName: findPreferenceField(preferences, "chatWallpaper")?.value ?? "",
        chatWallpaperFile: null,
        colorPalette: findPreferenceField(preferences, "colorPalette")?.activePaletteId ?? "dark",
        chatFontSize: findPreferenceField(preferences, "chatFontSize")?.value ?? "Medium",
        showReadCheck: findPreferenceField(preferences, "showReadCheck")?.defaultChecked ?? true
    };
}

function PreferencesField({ field, values, updateValue, updateWallpaper }) {
    if (field.type === "select") {
        return (
            <label className="preferences-form-row">
                <span>{field.title}</span>
                <select
                    value={values.language}
                    onChange={(event) => updateValue("language", event.target.value)}
                >
                    {field.options.map((option) => (
                        <option key={option} value={option}>
                            {field.optionLabels?.[option] ?? option}
                        </option>
                    ))}
                </select>
            </label>
        );
    }

    if (field.type === "file") {
        return (
            <label className="preferences-form-row file">
                <span>{field.title}</span>
                <small>{field.description}</small>
                <div className="preferences-form-file">
                    <Image />
                    <p>{values.chatWallpaperName || field.emptyLabel}</p>
                    <Upload />
                </div>
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => {
                        const file = event.target.files?.[0];

                        updateWallpaper(file);
                    }}
                />
            </label>
        );
    }

    if (field.type === "palette") {
        return (
            <div className="preferences-form-row palette">
                <span>{field.title}</span>
                <div className="preferences-form-palettes">
                    {field.palettes.map((palette) => (
                        <button
                            className={`preferences-form-palette ${palette.id === values.colorPalette ? "active" : ""}`}
                            key={palette.id}
                            type="button"
                            aria-label={palette.label}
                            onClick={() => updateValue("colorPalette", palette.id)}
                        >
                            <span className="preferences-form-palette-colors">
                                {palette.colors.map((color) => (
                                    <span key={color} style={{ backgroundColor: color }} />
                                ))}
                            </span>
                            <small>{palette.label}</small>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (field.type === "range") {
        return (
            <div className="preferences-form-row">
                <span>{field.title}</span>
                <div className="preferences-form-size">
                    {field.options.map((fontSize) => (
                        <button
                            className={fontSize === values.chatFontSize ? "active" : ""}
                            key={fontSize}
                            type="button"
                            onClick={() => updateValue("chatFontSize", fontSize)}
                        >
                            {field.optionLabels?.[fontSize] ?? fontSize}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <label className="preferences-form-row inline">
            <span>{field.title}</span>
            <input
                type="checkbox"
                checked={values.showReadCheck}
                onChange={(event) => updateValue("showReadCheck", event.target.checked)}
            />
        </label>
    );
}

function PreferencesForm({ preferences, handleSubmitPreferences }) {
    const [values, setValues] = useState(() => getPreferencesFormValues(preferences));

    function updateValue(name, value) {
        const nextValues = {
            ...values,
            [name]: value
        };

        setValues(nextValues);
    }

    function updateWallpaper(file) {
        const nextValues = {
            ...values,
            chatWallpaperName: file?.name ?? "",
            chatWallpaperFile: file ?? null
        };

        setValues(nextValues);
    }

    function resetValues() {
        const nextValues = getPreferencesFormValues(preferences);

        setValues(nextValues);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await handleSubmitPreferences(values);
    }

    return (
        <form className="preferences-form" onSubmit={handleSubmit}>
            <div className="preferences-form-header">
                <div>
                    <p>{preferences.title}</p>
                </div>
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
                <button
                    className="preferences-form-cancel"
                    type="button"
                    onClick={resetValues}
                >
                    {preferences.actions.reset}
                </button>
                <button className="preferences-form-submit" type="submit">
                    {preferences.actions.save}
                </button>
            </div>
        </form>
    );
}

export default PreferencesForm;
