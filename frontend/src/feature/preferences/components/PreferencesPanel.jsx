import PreferencesForm from "../../../shared/ui/forms/preferences/PreferencesForm.jsx";

function PreferencesPanel({ preferences, handleSubmitPreferences }) {
    return (
        <PreferencesForm
            key={preferences.formKey}
            preferences={preferences}
            handleSubmitPreferences={handleSubmitPreferences}
        />
    );
}

export default PreferencesPanel;
