import "./AppLayout.css";
import AppSideBar from "./sidebar/AppSidebar.jsx";
import AppTopBar from "./topbar/AppTopBar.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import PreferencesPanel from "../../../feature/preferences/components/PreferencesPanel.jsx";
import { usePreferences } from "../../../feature/preferences/hooks/usePreferences.js";
import { PreferencesContext } from "../../../feature/preferences/context/PreferencesContext.js";

function AppLayout() {
    const location = useLocation();
    const [showPreferences, setShowPreferences] = useState(false);
    const {
        activePreferencesData,
        preferencesForm,
        preferencesClassName,
        preferencesStyle,
        preferencesTexts,
        handleSubmitPreferences
    } = usePreferences();

    function closePreferences() {
        setShowPreferences(false);
    }

    function togglePreferences() {
        if (showPreferences) {
            closePreferences();
            return;
        }

        setShowPreferences(true);
    }

    async function savePreferences(preferencesValues) {
        const wasSaved = await handleSubmitPreferences(preferencesValues);

        if (wasSaved) {
            setShowPreferences(false);
        }
    }

    return (
        <PreferencesContext.Provider value={{ preferences: activePreferencesData, texts: preferencesTexts }}>
            <div className={`app-layout ${preferencesClassName}`} style={preferencesStyle}>
                <AppSideBar />
                <div className="app-layout-content">
                    <AppTopBar
                        showPreferences={showPreferences}
                        togglePreferences={togglePreferences}
                    />
                    <div className="app-layout-main">
                        <div className="app-layout-page" key={location.pathname}>
                            <Outlet/>
                        </div>
                        {showPreferences && (
                            <>
                                <button
                                    className="app-layout-preferences-backdrop"
                                    type="button"
                                    onClick={closePreferences}
                                    aria-label={preferencesTexts.preferences.close}
                                />
                                <PreferencesPanel
                                    preferences={preferencesForm}
                                    handleSubmitPreferences={savePreferences}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PreferencesContext.Provider>
    );
}

export default AppLayout;
