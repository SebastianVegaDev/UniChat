import PreferencesForm from "./PreferencesForm.jsx";

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