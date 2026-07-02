import "./StatusPill.css";
import type { ReactNode } from "react";

function StatusPill({ children, type = "default" }: { children: ReactNode; type?: string }) {
    return <span className={`status-pill status-pill-${type}`}>{children}</span>;
}

export default StatusPill;
