import "./SectionHero.css";

function SectionHero({ eyebrow, title, description }) {
    return (
        <div className="section-hero">
            {eyebrow && <p className="section-hero-eyebrow">{eyebrow}</p>}
            <h2>{title}</h2>
            <span>{description}</span>
        </div>
    );
}

export default SectionHero;
