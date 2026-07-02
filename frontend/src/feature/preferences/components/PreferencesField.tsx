import "./PreferencesField.css";
import { Image, Trash2, Upload } from "lucide-react";
import AppButton from "../../../shared/ui/primitives/button/AppButton.jsx";

function PreferencesField({ field, values, updateValue, updateWallpaper }) {
    if (field.type === "select") {
        return (
            <label className="preferences-field">
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
            <label className="preferences-field preferences-field-file">
                <span>{field.title}</span>
                <small>{field.description}</small>

                <div className="preferences-field-file-box">
                    <Image />
                    <p>{values.chatWallpaperName || field.emptyLabel}</p>
                    <Upload />
                </div>

                {(values.chatWallpaperName || values.chatWallpaperUrl) && (
                    <AppButton
                        icon={Trash2}
                        size="sm"
                        variant="secondary"
                        onClick={(event) => {
                            event.preventDefault();
                            updateWallpaper(null, true);
                        }}
                    >
                        {field.removeLabel}
                    </AppButton>
                )}

                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => {
                        const file = event.target.files?.[0];

                        updateWallpaper(file, false);
                    }}
                />
            </label>
        );
    }

    if (field.type === "palette") {
        return (
            <div className="preferences-field preferences-field-palette">
                <span>{field.title}</span>

                <div className="preferences-field-palettes">
                    {field.palettes.map((palette) => (
                        <button
                            className={`preferences-field-palette-option ${palette.id === values.colorPalette ? "active" : ""}`}
                            key={palette.id}
                            type="button"
                            aria-label={palette.label}
                            onClick={() => updateValue("colorPalette", palette.id)}
                        >
                            <span className="preferences-field-palette-colors">
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
            <div className="preferences-field">
                <span>{field.title}</span>

                <div className="preferences-field-size-options">
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
        <label className="preferences-field preferences-field-inline">
            <span>{field.title}</span>
            <input
                type="checkbox"
                checked={values.showReadCheck}
                onChange={(event) => updateValue("showReadCheck", event.target.checked)}
            />
        </label>
    );
}

export default PreferencesField;