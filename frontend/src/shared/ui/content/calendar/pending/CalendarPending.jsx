import "./CalendarPending.css";
import { usePreferenceTexts } from "../../../../../feature/preferences/context/PreferencesContext.js";

function CalendarPending({pendingItems}) {
    const { calendar } = usePreferenceTexts();

    return (
        <div className="calendar-pending">
            <p>{calendar.pendingThisMonth}</p>
            <div className="calendar-pending-cards">
                { pendingItems.map((pending) => (
                    <div className="calendar-pending-card" key={pending.id}>
                        <span>{pending.dateLabel}</span>
                        <div className="calendar-pending-card-info">
                            <div className="calendar-pending-card-title">
                                <p>{pending.title}</p>
                                <span>{pending.eventType}</span>
                            </div>
                            <span>{pending.detail}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CalendarPending;
