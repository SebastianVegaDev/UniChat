import "./AdminSummaryGrid.css";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";

function AdminSummaryGrid({ summary }) {
    const { admin } = usePreferenceTexts();

    const items = [
        { label: admin.labels.totalUsers, value: summary.totalUsers },
        { label: admin.labels.admins, value: summary.admins },
        { label: admin.labels.teachers, value: summary.teachers },
        { label: admin.labels.students, value: summary.students },
        { label: admin.labels.pendingDelegates, value: summary.pendingDelegates }
    ];

    return (
        <div className="admin-summary-grid">
            {items.map((item) => (
                <div className="admin-summary-card" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                </div>
            ))}
        </div>
    );
}

export default AdminSummaryGrid;