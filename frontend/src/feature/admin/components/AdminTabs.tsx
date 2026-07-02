import "./AdminTabs.css";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import { ADMIN_SECTION_ICONS, ADMIN_SECTIONS } from "../helpers/adminSections.js";

function AdminTabs({ activeSection, setActiveSection }) {
    const { admin } = usePreferenceTexts();

    return (
        <div className="admin-tabs">
            {ADMIN_SECTIONS.map((sectionId) => {
                const Icon = ADMIN_SECTION_ICONS[sectionId];

                return (
                    <button
                        key={sectionId}
                        className={activeSection === sectionId ? "active" : ""}
                        type="button"
                        onClick={() => setActiveSection(sectionId)}
                    >
                        <Icon />
                        <span>{admin.sections[sectionId]}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default AdminTabs;