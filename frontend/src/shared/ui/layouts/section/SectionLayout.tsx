import "./SectionLayout.css";
import type { ReactNode } from "react";

function SectionLayout({ children }: { children: ReactNode }) {
    return (
        <div className="section-layout">
            { children }
        </div>
    );
}

export default SectionLayout;
