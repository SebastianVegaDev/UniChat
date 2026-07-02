import "./CalendarPendingItem.css";
import StatusPill from "../../../shared/ui/primitives/status/StatusPill.jsx";

function CalendarPendingItem({ pending }) {
    return (
        <article className="calendar-pending-item">
            <span className="calendar-pending-item-date">{pending.dateLabel}</span>

            <div className="calendar-pending-item-info">
                <div className="calendar-pending-item-title">
                    <p>{pending.title}</p>
                    <StatusPill type="pending">{pending.eventType}</StatusPill>
                </div>

                <span>{pending.detail}</span>
            </div>
        </article>
    );
}

export default CalendarPendingItem;