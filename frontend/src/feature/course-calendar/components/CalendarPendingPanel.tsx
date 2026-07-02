import "./CalendarPendingPanel.css";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import EmptyText from "../../../shared/ui/primitives/empty/EmptyText.jsx";
import CalendarPendingItem from "./CalendarPendingItem.jsx";

function CalendarPendingPanel({ pendingItems }) {
    const { calendar } = usePreferenceTexts();

    return (
        <aside className="calendar-pending-panel">
            <div className="calendar-pending-panel-header">
                <h3>{calendar.pendingThisMonth}</h3>
                <span>{pendingItems.length}</span>
            </div>

            <div className="calendar-pending-panel-list">
                {pendingItems.length === 0 && (
                    <EmptyText>No hay pendientes este mes.</EmptyText>
                )}

                {pendingItems.map((pending) => (
                    <CalendarPendingItem key={pending.id} pending={pending} />
                ))}
            </div>
        </aside>
    );
}

export default CalendarPendingPanel;