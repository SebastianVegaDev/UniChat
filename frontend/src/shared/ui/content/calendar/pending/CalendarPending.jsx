import "./CalendarPending.css";

function CalendarPending({pendingItems}) {
    return (
        <div className="calendar-pending">
            <p>Pending this month</p>
            <div className="calendar-pending-cards">
                { pendingItems.map((pending) => (
                    <div className="calendar-pending-card" key={pending.id}>
                        <span>{pending.dateLabel}</span>
                        <div className="calendar-pending-card-info">
                            <p>{pending.title}</p>
                            <span>{pending.detail}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CalendarPending;
