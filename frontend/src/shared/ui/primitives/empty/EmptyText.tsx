import "./EmptyText.css";
import type { ReactNode } from "react";

function EmptyText({ children }: { children: ReactNode }) {
    return <p className="empty-text">{children}</p>;
}

export default EmptyText;
