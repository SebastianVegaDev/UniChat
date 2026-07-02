import "./SectionHero.css";
import type { ReactNode } from "react";

interface SectionHeroProps {
    eyebrow?: ReactNode;
    title: string;
    description: string;
}

function SectionHero({ eyebrow, title, description }: SectionHeroProps) {
    return (
        <div className="section-hero">
            {eyebrow && <p className="section-hero-eyebrow">{eyebrow}</p>}
            <h2>{title}</h2>
            <span>{description}</span>
        </div>
    );
}

export default SectionHero;
