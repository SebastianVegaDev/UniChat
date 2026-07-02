import "./StatusPill.css";

function StatusPill({ children, type = "default" }) {
    return <span className={`status-pill status-pill-${type}`}>{children}</span>;
}

export default StatusPill;